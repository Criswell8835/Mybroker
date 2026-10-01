-- Security definer functions, RLS, and private KYC storage.
-- Internal posting functions are not granted to browser roles.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
      and ur.revoked_at is null
      and p.key = permission_key
  );
$$;

create or replace function public.write_audit(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.write_notification(
  p_user_id uuid,
  p_kind text,
  p_title text,
  p_body text,
  p_reference_type text,
  p_reference_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, kind, title, body, reference_type, reference_id)
  values (p_user_id, p_kind, p_title, coalesce(p_body, ''), p_reference_type, p_reference_id);
end;
$$;

create or replace function public.require_permission(permission_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.has_permission(permission_key) then
    raise exception 'permission denied' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.create_user_account(
  p_user_id uuid,
  p_kind public.account_kind,
  p_label text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account_id uuid;
begin
  insert into public.accounts (user_id, kind, label, status)
  values (p_user_id, p_kind, p_label, 'active')
  returning id into v_account_id;

  insert into public.ledger_accounts (owner_user_id, account_id, code, kind)
  values
    (p_user_id, v_account_id, 'available:' || v_account_id::text, 'user_available'),
    (p_user_id, v_account_id, 'held:' || v_account_id::text, 'user_held');

  return v_account_id;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
  v_name text;
begin
  v_name := nullif(btrim(coalesce(new.raw_user_meta_data->>'display_name', '')), '');
  if v_name is null then
    v_name := split_part(coalesce(new.email, 'user'), '@', 1);
  end if;
  if char_length(v_name) < 1 then
    v_name := 'User';
  end if;
  if char_length(v_name) > 80 then
    v_name := left(v_name, 80);
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, v_name);

  select id into v_role_id from public.roles where key = 'user';
  insert into public.user_roles (user_id, role_id)
  values (new.id, v_role_id);

  perform public.create_user_account(new.id, 'funding', 'Funding');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.platform_ledger_account(p_kind public.ledger_account_kind)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.ledger_accounts where kind = p_kind and account_id is null limit 1;
$$;

create or replace function public.user_ledger_account(
  p_account_id uuid,
  p_kind public.ledger_account_kind
)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.ledger_accounts
  where account_id = p_account_id
    and kind = p_kind;
$$;

create or replace function public.funding_account(p_user_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.accounts
  where user_id = p_user_id
    and kind = 'funding'
    and status = 'active'
  order by created_at
  limit 1;
$$;

-- Balanced journal. Updates the balance cache only for user buckets.
create or replace function public.post_journal(
  p_kind text,
  p_reference_type text,
  p_reference_id uuid,
  p_description text,
  p_entries jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tx uuid;
  v_asset uuid;
  v_debit numeric(38, 18);
  v_credit numeric(38, 18);
  v_entry jsonb;
  v_ledger_id uuid;
  v_direction public.ledger_direction;
  v_amount numeric(38, 18);
  v_account_id uuid;
  v_ledger_kind public.ledger_account_kind;
begin
  if p_entries is null or jsonb_array_length(p_entries) < 2 then
    raise exception 'journal requires at least two entries';
  end if;

  for v_asset in
    select distinct (value->>'asset_id')::uuid
    from jsonb_array_elements(p_entries)
  loop
    select
      coalesce(sum(case when value->>'direction' = 'debit' then (value->>'amount')::numeric else 0 end), 0),
      coalesce(sum(case when value->>'direction' = 'credit' then (value->>'amount')::numeric else 0 end), 0)
    into v_debit, v_credit
    from jsonb_array_elements(p_entries)
    where (value->>'asset_id')::uuid = v_asset;

    if v_debit <> v_credit or v_debit <= 0 then
      raise exception 'unbalanced journal';
    end if;
  end loop;

  insert into public.ledger_transactions (kind, reference_type, reference_id, description, created_by)
  values (p_kind, p_reference_type, p_reference_id, coalesce(p_description, ''), auth.uid())
  returning id into v_tx;

  for v_entry in
    select value from jsonb_array_elements(p_entries)
  loop
    v_ledger_id := (v_entry->>'ledger_account_id')::uuid;
    v_direction := (v_entry->>'direction')::public.ledger_direction;
    v_amount := (v_entry->>'amount')::numeric(38, 18);
    v_asset := (v_entry->>'asset_id')::uuid;

    if v_amount is null or v_amount <= 0 then
      raise exception 'amount must be positive';
    end if;

    select account_id, kind into v_account_id, v_ledger_kind
    from public.ledger_accounts
    where id = v_ledger_id;

    if not found then
      raise exception 'ledger account not found';
    end if;

    if v_ledger_kind in ('user_available', 'user_held') then
      insert into public.account_balances (account_id, asset_id, available, held)
      values (v_account_id, v_asset, 0, 0)
      on conflict (account_id, asset_id) do nothing;

      if v_ledger_kind = 'user_available' and v_direction = 'debit' then
        update public.account_balances
        set available = available - v_amount, updated_at = now()
        where account_id = v_account_id and asset_id = v_asset and available >= v_amount;
        if not found then
          raise exception 'insufficient available balance';
        end if;
      elsif v_ledger_kind = 'user_available' and v_direction = 'credit' then
        update public.account_balances
        set available = available + v_amount, updated_at = now()
        where account_id = v_account_id and asset_id = v_asset;
      elsif v_ledger_kind = 'user_held' and v_direction = 'debit' then
        update public.account_balances
        set held = held - v_amount, updated_at = now()
        where account_id = v_account_id and asset_id = v_asset and held >= v_amount;
        if not found then
          raise exception 'insufficient held balance';
        end if;
      else
        update public.account_balances
        set held = held + v_amount, updated_at = now()
        where account_id = v_account_id and asset_id = v_asset;
      end if;
    end if;

    insert into public.ledger_entries (transaction_id, ledger_account_id, asset_id, direction, amount)
    values (v_tx, v_ledger_id, v_asset, v_direction, v_amount);
  end loop;

  return v_tx;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin adjustments, deposits, withdrawals, KYC, roles
-- ---------------------------------------------------------------------------

create or replace function public.admin_adjust_balance(
  p_user_id uuid,
  p_asset_id uuid,
  p_direction public.adjustment_direction,
  p_amount numeric,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account uuid;
  v_available uuid;
  v_platform uuid;
  v_tx uuid;
  v_adjustment uuid;
  v_entries jsonb;
begin
  perform public.require_permission('balances.adjust');
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  if char_length(btrim(coalesce(p_reason, ''))) < 3 then
    raise exception 'reason is required';
  end if;

  v_account := public.funding_account(p_user_id);
  if v_account is null then
    raise exception 'funding account not found';
  end if;
  v_available := public.user_ledger_account(v_account, 'user_available');
  v_platform := public.platform_ledger_account('adjustment');
  v_adjustment := gen_random_uuid();

  if p_direction = 'credit' then
    v_entries := jsonb_build_array(
      jsonb_build_object('ledger_account_id', v_platform, 'asset_id', p_asset_id, 'direction', 'debit', 'amount', p_amount::text),
      jsonb_build_object('ledger_account_id', v_available, 'asset_id', p_asset_id, 'direction', 'credit', 'amount', p_amount::text)
    );
  else
    v_entries := jsonb_build_array(
      jsonb_build_object('ledger_account_id', v_available, 'asset_id', p_asset_id, 'direction', 'debit', 'amount', p_amount::text),
      jsonb_build_object('ledger_account_id', v_platform, 'asset_id', p_asset_id, 'direction', 'credit', 'amount', p_amount::text)
    );
  end if;

  v_tx := public.post_journal('adjustment', 'balance_adjustment', v_adjustment, btrim(p_reason), v_entries);

  insert into public.balance_adjustments (
    id, user_id, account_id, asset_id, direction, amount, reason, admin_id, ledger_transaction_id
  ) values (
    v_adjustment, p_user_id, v_account, p_asset_id, p_direction, p_amount, btrim(p_reason), auth.uid(), v_tx
  );

  perform public.write_audit(
    'balance.adjust',
    'balance_adjustment',
    v_adjustment,
    jsonb_build_object('user_id', p_user_id, 'asset_id', p_asset_id, 'direction', p_direction, 'amount', p_amount, 'reason', btrim(p_reason), 'ledger_transaction_id', v_tx)
  );
  perform public.write_notification(
    p_user_id,
    'adjustment',
    'Account adjustment',
    'An administrator adjusted your balance.',
    'balance_adjustment',
    v_adjustment
  );
  return v_adjustment;
end;
$$;

create or replace function public.create_deposit(
  p_asset_id uuid,
  p_network_id uuid,
  p_amount numeric,
  p_reference text,
  p_destination_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_account uuid;
  v_id uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  if not exists (
    select 1
    from public.asset_networks an
    where an.asset_id = p_asset_id
      and an.network_id = p_network_id
      and an.deposit_enabled
  ) then
    raise exception 'deposits are not enabled for this asset and network';
  end if;
  if p_destination_id is not null and not exists (
    select 1
    from public.deposit_destinations d
    join public.asset_networks an on an.id = d.asset_network_id
    where d.id = p_destination_id
      and d.is_active
      and an.asset_id = p_asset_id
      and an.network_id = p_network_id
  ) then
    raise exception 'deposit destination is not available';
  end if;

  v_account := public.funding_account(v_user);
  insert into public.deposits (
    user_id, account_id, asset_id, network_id, destination_id, amount, status, reference
  ) values (
    v_user, v_account, p_asset_id, p_network_id, p_destination_id, p_amount, 'pending', nullif(btrim(coalesce(p_reference, '')), '')
  ) returning id into v_id;

  perform public.write_audit('deposit.create', 'deposit', v_id, jsonb_build_object('amount', p_amount, 'asset_id', p_asset_id));
  return v_id;
end;
$$;

create or replace function public.cancel_deposit(p_deposit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.deposits
  set status = 'cancelled'
  where id = p_deposit_id
    and user_id = auth.uid()
    and status = 'pending';
  if not found then
    raise exception 'deposit cannot be cancelled';
  end if;
  perform public.write_audit('deposit.cancel', 'deposit', p_deposit_id, '{}'::jsonb);
end;
$$;

create or replace function public.review_deposit(
  p_deposit_id uuid,
  p_decision text,
  p_reason text default null,
  p_tx_hash text default null,
  p_confirmations integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deposit public.deposits%rowtype;
  v_tx uuid;
  v_entries jsonb;
begin
  perform public.require_permission('deposits.review');
  select * into v_deposit from public.deposits where id = p_deposit_id for update;
  if not found or v_deposit.status <> 'pending' then
    raise exception 'deposit is not pending';
  end if;

  if p_decision = 'approved' then
    v_entries := jsonb_build_array(
      jsonb_build_object(
        'ledger_account_id', public.platform_ledger_account('deposit_clearing'),
        'asset_id', v_deposit.asset_id,
        'direction', 'debit',
        'amount', v_deposit.amount::text
      ),
      jsonb_build_object(
        'ledger_account_id', public.user_ledger_account(v_deposit.account_id, 'user_available'),
        'asset_id', v_deposit.asset_id,
        'direction', 'credit',
        'amount', v_deposit.amount::text
      )
    );
    v_tx := public.post_journal('deposit', 'deposit', v_deposit.id, 'Deposit approved', v_entries);
    update public.deposits
    set status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        tx_hash = nullif(btrim(coalesce(p_tx_hash, '')), ''),
        confirmations = p_confirmations,
        ledger_transaction_id = v_tx
    where id = v_deposit.id;
    perform public.write_notification(v_deposit.user_id, 'deposit', 'Deposit approved', 'Your deposit was approved.', 'deposit', v_deposit.id);
  elsif p_decision = 'rejected' then
    if char_length(btrim(coalesce(p_reason, ''))) < 3 then
      raise exception 'rejection reason is required';
    end if;
    update public.deposits
    set status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        rejection_reason = btrim(p_reason),
        tx_hash = nullif(btrim(coalesce(p_tx_hash, '')), ''),
        confirmations = p_confirmations
    where id = v_deposit.id;
    perform public.write_notification(v_deposit.user_id, 'deposit', 'Deposit rejected', btrim(p_reason), 'deposit', v_deposit.id);
  else
    raise exception 'decision must be approved or rejected';
  end if;

  perform public.write_audit(
    'deposit.review',
    'deposit',
    v_deposit.id,
    jsonb_build_object('decision', p_decision, 'reason', p_reason)
  );
end;
$$;

create or replace function public.request_withdrawal(
  p_asset_id uuid,
  p_network_id uuid,
  p_destination_address text,
  p_amount numeric
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_account uuid;
  v_id uuid;
  v_tx uuid;
  v_address text := btrim(coalesce(p_destination_address, ''));
  v_entries jsonb;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  if char_length(v_address) < 10 then
    raise exception 'destination address is required';
  end if;
  if not exists (
    select 1 from public.asset_networks an
    where an.asset_id = p_asset_id
      and an.network_id = p_network_id
      and an.withdrawal_enabled
  ) then
    raise exception 'withdrawals are not enabled for this asset and network';
  end if;

  v_account := public.funding_account(v_user);
  v_id := gen_random_uuid();
  v_entries := jsonb_build_array(
    jsonb_build_object(
      'ledger_account_id', public.user_ledger_account(v_account, 'user_available'),
      'asset_id', p_asset_id, 'direction', 'debit', 'amount', p_amount::text
    ),
    jsonb_build_object(
      'ledger_account_id', public.user_ledger_account(v_account, 'user_held'),
      'asset_id', p_asset_id, 'direction', 'credit', 'amount', p_amount::text
    )
  );
  v_tx := public.post_journal('withdrawal_lock', 'withdrawal', v_id, 'Withdrawal requested', v_entries);

  insert into public.withdrawals (
    id, user_id, account_id, asset_id, network_id, destination_address, amount, status, ledger_lock_transaction_id
  ) values (
    v_id, v_user, v_account, p_asset_id, p_network_id, v_address, p_amount, 'pending', v_tx
  );
  perform public.write_audit('withdrawal.request', 'withdrawal', v_id, jsonb_build_object('amount', p_amount, 'asset_id', p_asset_id));
  return v_id;
end;
$$;

create or replace function public.release_withdrawal_hold(p_withdrawal public.withdrawals)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entries jsonb;
begin
  v_entries := jsonb_build_array(
    jsonb_build_object(
      'ledger_account_id', public.user_ledger_account(p_withdrawal.account_id, 'user_held'),
      'asset_id', p_withdrawal.asset_id, 'direction', 'debit', 'amount', p_withdrawal.amount::text
    ),
    jsonb_build_object(
      'ledger_account_id', public.user_ledger_account(p_withdrawal.account_id, 'user_available'),
      'asset_id', p_withdrawal.asset_id, 'direction', 'credit', 'amount', p_withdrawal.amount::text
    )
  );
  return public.post_journal('withdrawal_release', 'withdrawal', p_withdrawal.id, 'Withdrawal released', v_entries);
end;
$$;

create or replace function public.cancel_withdrawal(p_withdrawal_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.withdrawals%rowtype;
  v_release uuid;
begin
  select * into v_row
  from public.withdrawals
  where id = p_withdrawal_id and user_id = auth.uid()
  for update;
  if not found or v_row.status <> 'pending' then
    raise exception 'withdrawal cannot be cancelled';
  end if;
  v_release := public.release_withdrawal_hold(v_row);
  update public.withdrawals
  set status = 'cancelled', ledger_settlement_transaction_id = v_release
  where id = v_row.id;
  perform public.write_audit('withdrawal.cancel', 'withdrawal', v_row.id, '{}'::jsonb);
end;
$$;

create or replace function public.review_withdrawal(
  p_withdrawal_id uuid,
  p_decision text,
  p_reason text default null,
  p_tx_hash text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.withdrawals%rowtype;
  v_tx uuid;
  v_entries jsonb;
begin
  perform public.require_permission('withdrawals.review');
  select * into v_row from public.withdrawals where id = p_withdrawal_id for update;
  if not found or v_row.status <> 'pending' then
    raise exception 'withdrawal is not pending';
  end if;

  if p_decision = 'approved' then
    v_entries := jsonb_build_array(
      jsonb_build_object(
        'ledger_account_id', public.user_ledger_account(v_row.account_id, 'user_held'),
        'asset_id', v_row.asset_id, 'direction', 'debit', 'amount', v_row.amount::text
      ),
      jsonb_build_object(
        'ledger_account_id', public.platform_ledger_account('withdrawal_clearing'),
        'asset_id', v_row.asset_id, 'direction', 'credit', 'amount', v_row.amount::text
      )
    );
    v_tx := public.post_journal('withdrawal_settle', 'withdrawal', v_row.id, 'Withdrawal approved', v_entries);
    update public.withdrawals
    set status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        tx_hash = nullif(btrim(coalesce(p_tx_hash, '')), ''),
        ledger_settlement_transaction_id = v_tx
    where id = v_row.id;
    perform public.write_notification(v_row.user_id, 'withdrawal', 'Withdrawal approved', 'Your withdrawal was approved.', 'withdrawal', v_row.id);
  elsif p_decision = 'rejected' then
    if char_length(btrim(coalesce(p_reason, ''))) < 3 then
      raise exception 'rejection reason is required';
    end if;
    v_tx := public.release_withdrawal_hold(v_row);
    update public.withdrawals
    set status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        rejection_reason = btrim(p_reason),
        ledger_settlement_transaction_id = v_tx
    where id = v_row.id;
    perform public.write_notification(v_row.user_id, 'withdrawal', 'Withdrawal rejected', btrim(p_reason), 'withdrawal', v_row.id);
  else
    raise exception 'decision must be approved or rejected';
  end if;

  perform public.write_audit(
    'withdrawal.review',
    'withdrawal',
    v_row.id,
    jsonb_build_object('decision', p_decision, 'reason', p_reason)
  );
end;
$$;

create or replace function public.submit_kyc(
  p_legal_name text,
  p_country text,
  p_document_type text,
  p_document_storage_path text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_status public.kyc_status;
  v_id uuid;
  v_path text := btrim(coalesce(p_document_storage_path, ''));
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if v_path !~ ('^' || v_user::text || '/[A-Za-z0-9._/-]+$') then
    raise exception 'document path must stay inside your KYC folder';
  end if;

  select kyc_status into v_status from public.profiles where id = v_user;
  if v_status in ('pending', 'verified') then
    raise exception 'KYC cannot be submitted in the current state';
  end if;

  insert into public.kyc_submissions (user_id, legal_name, country, document_type, document_storage_path)
  values (v_user, btrim(p_legal_name), upper(btrim(p_country)), btrim(p_document_type), v_path)
  returning id into v_id;

  perform set_config('app.trusted_profile_write', 'on', true);
  update public.profiles set kyc_status = 'pending' where id = v_user;
  perform public.write_audit('kyc.submit', 'kyc_submission', v_id, jsonb_build_object('document_type', btrim(p_document_type)));
  return v_id;
end;
$$;

create or replace function public.review_kyc(
  p_submission_id uuid,
  p_decision public.kyc_submission_status,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.kyc_submissions%rowtype;
  v_profile_status public.kyc_status;
begin
  perform public.require_permission('kyc.review');
  if p_decision = 'pending' then
    raise exception 'decision cannot be pending';
  end if;
  if p_decision <> 'verified' and char_length(btrim(coalesce(p_reason, ''))) < 3 then
    raise exception 'reason is required';
  end if;

  select * into v_row from public.kyc_submissions where id = p_submission_id for update;
  if not found or v_row.status <> 'pending' then
    raise exception 'submission is not pending';
  end if;

  update public.kyc_submissions set status = p_decision where id = v_row.id;
  insert into public.kyc_reviews (submission_id, reviewer_id, decision, reason)
  values (v_row.id, auth.uid(), p_decision, nullif(btrim(coalesce(p_reason, '')), ''));

  v_profile_status := p_decision::text::public.kyc_status;
  perform set_config('app.trusted_profile_write', 'on', true);
  update public.profiles set kyc_status = v_profile_status where id = v_row.user_id;

  perform public.write_notification(
    v_row.user_id,
    'kyc',
    'KYC updated',
    case when p_decision = 'verified' then 'Your identity review is complete.' else coalesce(btrim(p_reason), 'Your identity submission was updated.') end,
    'kyc_submission',
    v_row.id
  );
  perform public.write_audit('kyc.review', 'kyc_submission', v_row.id, jsonb_build_object('decision', p_decision, 'reason', p_reason));
end;
$$;

create or replace function public.admin_grant_role(p_user_id uuid, p_role_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role uuid;
begin
  perform public.require_permission('roles.manage');
  if p_role_key = 'user' then
    raise exception 'the user role is assigned at signup';
  end if;
  select id into v_role from public.roles where key = p_role_key;
  if v_role is null then
    raise exception 'role not found';
  end if;
  insert into public.user_roles (user_id, role_id, granted_by)
  values (p_user_id, v_role, auth.uid());
  perform public.write_audit('role.grant', 'user_role', p_user_id, jsonb_build_object('role', p_role_key));
end;
$$;

create or replace function public.admin_revoke_role(p_user_id uuid, p_role_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role uuid;
begin
  perform public.require_permission('roles.manage');
  select id into v_role from public.roles where key = p_role_key;
  update public.user_roles
  set revoked_at = now()
  where user_id = p_user_id and role_id = v_role and revoked_at is null;
  if not found then
    raise exception 'active role assignment not found';
  end if;
  perform public.write_audit('role.revoke', 'user_role', p_user_id, jsonb_build_object('role', p_role_key));
end;
$$;

create or replace function public.admin_set_deposit_destination(
  p_asset_network_id uuid,
  p_label text,
  p_address text,
  p_is_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_address text := nullif(btrim(coalesce(p_address, '')), '');
begin
  perform public.require_permission('assets.manage');
  if v_address is not null and char_length(v_address) < 10 then
    raise exception 'address is too short';
  end if;
  insert into public.deposit_destinations (asset_network_id, label, address, is_active, created_by)
  values (p_asset_network_id, btrim(p_label), v_address, coalesce(p_is_active, false), auth.uid())
  returning id into v_id;
  perform public.write_audit('destination.create', 'deposit_destination', v_id, jsonb_build_object('active', p_is_active));
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Professional traders and copy relationships
-- ---------------------------------------------------------------------------

create or replace function public.admin_create_professional_trader(
  p_slug text,
  p_display_name text,
  p_biography text,
  p_risk_level public.risk_level,
  p_strategy_name text,
  p_strategy_description text,
  p_instrument_ids uuid[],
  p_min_allocation_amount numeric default null,
  p_min_allocation_asset_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trader uuid;
  v_strategy uuid;
  v_account uuid;
  v_instrument uuid;
begin
  perform public.require_permission('traders.manage');
  if p_instrument_ids is null or cardinality(p_instrument_ids) < 1 then
    raise exception 'at least one instrument is required';
  end if;

  insert into public.professional_traders (
    slug, display_name, biography, risk_level, status, visibility,
    min_allocation_amount, min_allocation_asset_id, created_by
  ) values (
    lower(btrim(p_slug)), btrim(p_display_name), coalesce(p_biography, ''), p_risk_level,
    'draft', 'hidden', p_min_allocation_amount, p_min_allocation_asset_id, auth.uid()
  ) returning id into v_trader;

  insert into public.professional_trader_strategies (
    professional_trader_id, name, description, is_current
  ) values (
    v_trader, btrim(p_strategy_name), coalesce(p_strategy_description, ''), true
  ) returning id into v_strategy;

  foreach v_instrument in array p_instrument_ids loop
    insert into public.professional_trader_assets (strategy_id, instrument_id)
    values (v_strategy, v_instrument);
  end loop;

  insert into public.professional_trader_accounts (
    professional_trader_id, strategy_id, label, is_primary, status
  ) values (
    v_trader, v_strategy, 'Primary', true, 'active'
  ) returning id into v_account;

  perform public.write_audit('trader.create', 'professional_trader', v_trader, jsonb_build_object('account_id', v_account));
  return v_trader;
end;
$$;

create or replace function public.admin_set_trader_listing(
  p_trader_id uuid,
  p_status public.trader_status,
  p_visibility public.trader_visibility
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_permission('traders.manage');
  if p_visibility = 'listed' and p_status <> 'active' then
    raise exception 'only an active trader can be listed';
  end if;
  update public.professional_traders
  set status = p_status, visibility = p_visibility
  where id = p_trader_id;
  if not found then
    raise exception 'trader not found';
  end if;
  perform public.write_audit(
    'trader.listing',
    'professional_trader',
    p_trader_id,
    jsonb_build_object('status', p_status, 'visibility', p_visibility)
  );
end;
$$;

create or replace function public.admin_record_master_trade(
  p_account_id uuid,
  p_event_type public.trade_event_type,
  p_side public.position_side,
  p_instrument_id uuid,
  p_quantity numeric,
  p_price numeric,
  p_occurred_at timestamptz,
  p_position_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_position public.professional_trader_positions%rowtype;
  v_event uuid;
  v_qty numeric(38, 18) := p_quantity;
  v_next numeric(38, 18);
  v_entry numeric(38, 18);
begin
  perform public.require_permission('trades.record');
  if v_qty is null or v_qty <= 0 then
    raise exception 'quantity must be positive';
  end if;
  if not exists (
    select 1 from public.professional_trader_accounts
    where id = p_account_id and status = 'active'
  ) then
    raise exception 'master account is not active';
  end if;

  if p_event_type = 'open' then
    if p_position_id is not null then
      raise exception 'open creates a new position';
    end if;
    insert into public.professional_trader_positions (
      professional_trader_account_id, instrument_id, side, status, quantity, entry_price, opened_at
    ) values (
      p_account_id, p_instrument_id, p_side, 'open', v_qty, p_price, coalesce(p_occurred_at, now())
    ) returning * into v_position;
  else
    select * into v_position
    from public.professional_trader_positions
    where id = p_position_id
      and professional_trader_account_id = p_account_id
    for update;
    if not found or v_position.status <> 'open' then
      raise exception 'open master position not found';
    end if;
    if v_position.instrument_id <> p_instrument_id or v_position.side <> p_side then
      raise exception 'event does not match the position';
    end if;

    if p_event_type = 'increase' then
      v_next := v_position.quantity + v_qty;
      if p_price is not null and v_position.entry_price is not null then
        v_entry := ((v_position.quantity * v_position.entry_price) + (v_qty * p_price)) / v_next;
      else
        v_entry := coalesce(p_price, v_position.entry_price);
      end if;
      update public.professional_trader_positions
      set quantity = v_next, entry_price = v_entry
      where id = v_position.id;
    elsif p_event_type in ('decrease', 'partial_close') then
      if v_qty >= v_position.quantity then
        raise exception 'partial reduction must leave the position open';
      end if;
      update public.professional_trader_positions
      set quantity = v_position.quantity - v_qty
      where id = v_position.id;
    elsif p_event_type = 'close' then
      if v_qty <> v_position.quantity then
        raise exception 'close quantity must match the open quantity';
      end if;
      update public.professional_trader_positions
      set quantity = 0, status = 'closed', closed_at = coalesce(p_occurred_at, now())
      where id = v_position.id;
    else
      raise exception 'unsupported event';
    end if;
  end if;

  insert into public.professional_trader_trade_events (
    professional_trader_account_id, position_id, instrument_id, event_type, side,
    quantity, price, occurred_at, source, created_by
  ) values (
    p_account_id, v_position.id, p_instrument_id, p_event_type, p_side,
    v_qty, p_price, coalesce(p_occurred_at, now()), 'manual', auth.uid()
  ) returning id into v_event;

  perform public.write_audit('master_trade.record', 'professional_trader_trade_event', v_event, jsonb_build_object('event_type', p_event_type, 'position_id', v_position.id));
  return v_event;
end;
$$;

create or replace function public.start_copy(
  p_trader_id uuid,
  p_allocation_basis public.allocation_basis,
  p_allocation_amount numeric default null,
  p_allocation_asset_id uuid default null,
  p_master_ratio_bps integer default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_trader public.professional_traders%rowtype;
  v_account uuid;
  v_follower_account uuid;
  v_relationship uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select * into v_trader
  from public.professional_traders
  where id = p_trader_id and status = 'active' and visibility = 'listed';
  if not found then
    raise exception 'trader is not available';
  end if;

  select id into v_account
  from public.professional_trader_accounts
  where professional_trader_id = v_trader.id and is_primary and status = 'active';
  if v_account is null then
    raise exception 'master account is not available';
  end if;

  if v_trader.min_allocation_amount is not null then
    if p_allocation_basis <> 'fixed_amount'
      or p_allocation_asset_id is distinct from v_trader.min_allocation_asset_id
      or p_allocation_amount < v_trader.min_allocation_amount then
      raise exception 'allocation is below the trader minimum';
    end if;
  end if;

  v_follower_account := public.create_user_account(v_user, 'copy', 'Copy ' || v_trader.display_name);

  insert into public.copy_relationships (
    follower_user_id, professional_trader_id, professional_trader_account_id, follower_account_id, status
  ) values (
    v_user, v_trader.id, v_account, v_follower_account, 'active'
  ) returning id into v_relationship;

  insert into public.copy_settings (
    copy_relationship_id, allocation_basis, allocation_amount, allocation_asset_id,
    master_ratio_bps, copy_existing_positions
  ) values (
    v_relationship, p_allocation_basis, p_allocation_amount, p_allocation_asset_id,
    p_master_ratio_bps, false
  );

  insert into public.copy_setting_revisions (
    copy_relationship_id, allocation_basis, allocation_amount, allocation_asset_id,
    master_ratio_bps, copy_existing_positions, risk_config, effective_from
  ) values (
    v_relationship, p_allocation_basis, p_allocation_amount, p_allocation_asset_id,
    p_master_ratio_bps, false, '{}'::jsonb, now()
  );

  perform public.write_audit('copy.start', 'copy_relationship', v_relationship, jsonb_build_object('trader_id', v_trader.id));
  return v_relationship;
end;
$$;

create or replace function public.pause_copy(p_relationship_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.copy_relationships
  set status = 'paused', paused_at = now()
  where id = p_relationship_id and follower_user_id = auth.uid() and status = 'active';
  if not found then
    raise exception 'copy relationship cannot be paused';
  end if;
  perform public.write_audit('copy.pause', 'copy_relationship', p_relationship_id, '{}'::jsonb);
end;
$$;

create or replace function public.resume_copy(p_relationship_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trader uuid;
begin
  select professional_trader_id into v_trader
  from public.copy_relationships
  where id = p_relationship_id and follower_user_id = auth.uid() and status = 'paused';
  if v_trader is null then
    raise exception 'copy relationship cannot be resumed';
  end if;
  if not exists (
    select 1 from public.professional_traders
    where id = v_trader and status = 'active' and visibility = 'listed'
  ) then
    raise exception 'trader is not available';
  end if;
  update public.copy_relationships
  set status = 'active', paused_at = null
  where id = p_relationship_id;
  perform public.write_audit('copy.resume', 'copy_relationship', p_relationship_id, '{}'::jsonb);
end;
$$;

create or replace function public.stop_copy(p_relationship_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.copy_relationships
  set status = 'stopped', stopped_at = now(), stopped_reason = nullif(btrim(coalesce(p_reason, '')), '')
  where id = p_relationship_id
    and follower_user_id = auth.uid()
    and status in ('active', 'paused');
  if not found then
    raise exception 'copy relationship cannot be stopped';
  end if;
  perform public.write_audit('copy.stop', 'copy_relationship', p_relationship_id, jsonb_build_object('reason', p_reason));
end;
$$;

create or replace function public.update_copy_settings(
  p_relationship_id uuid,
  p_allocation_basis public.allocation_basis,
  p_allocation_amount numeric default null,
  p_allocation_asset_id uuid default null,
  p_master_ratio_bps integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rel public.copy_relationships%rowtype;
  v_trader public.professional_traders%rowtype;
  v_settings public.copy_settings%rowtype;
begin
  select * into v_rel
  from public.copy_relationships
  where id = p_relationship_id and follower_user_id = auth.uid() and status in ('active', 'paused');
  if not found then
    raise exception 'copy relationship is not editable';
  end if;
  select * into v_trader from public.professional_traders where id = v_rel.professional_trader_id;
  if v_trader.min_allocation_amount is not null then
    if p_allocation_basis <> 'fixed_amount'
      or p_allocation_asset_id is distinct from v_trader.min_allocation_asset_id
      or p_allocation_amount < v_trader.min_allocation_amount then
      raise exception 'allocation is below the trader minimum';
    end if;
  end if;

  select * into v_settings from public.copy_settings where copy_relationship_id = v_rel.id;
  insert into public.copy_setting_revisions (
    copy_relationship_id, allocation_basis, allocation_amount, allocation_asset_id,
    master_ratio_bps, copy_existing_positions, risk_config, effective_from
  ) values (
    v_rel.id, v_settings.allocation_basis, v_settings.allocation_amount, v_settings.allocation_asset_id,
    v_settings.master_ratio_bps, v_settings.copy_existing_positions, v_settings.risk_config, v_settings.effective_from
  );

  update public.copy_settings
  set allocation_basis = p_allocation_basis,
      allocation_amount = p_allocation_amount,
      allocation_asset_id = p_allocation_asset_id,
      master_ratio_bps = p_master_ratio_bps,
      effective_from = now()
  where copy_relationship_id = v_rel.id;

  perform public.write_audit('copy.settings', 'copy_relationship', v_rel.id, jsonb_build_object('basis', p_allocation_basis));
end;
$$;

-- ---------------------------------------------------------------------------
-- AI trading configuration. Status changes are recorded. No order routing.
-- ---------------------------------------------------------------------------

create or replace function public.create_ai_trading_config(
  p_instrument_id uuid,
  p_strategy_code text,
  p_risk_level public.risk_level,
  p_allocation_amount numeric,
  p_allocation_asset_id uuid,
  p_risk_config jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_account uuid;
  v_id uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  v_account := public.funding_account(v_user);
  insert into public.ai_trading_configs (
    user_id, account_id, instrument_id, strategy_code, risk_level, risk_config,
    allocation_amount, allocation_asset_id, status
  ) values (
    v_user, v_account, p_instrument_id, btrim(p_strategy_code), p_risk_level,
    coalesce(p_risk_config, '{}'::jsonb), p_allocation_amount, p_allocation_asset_id, 'inactive'
  ) returning id into v_id;

  insert into public.ai_trading_events (config_id, event_type, payload)
  values (v_id, 'created', jsonb_build_object('strategy_code', btrim(p_strategy_code)));
  return v_id;
end;
$$;

create or replace function public.update_ai_trading_config(
  p_config_id uuid,
  p_strategy_code text,
  p_risk_level public.risk_level,
  p_allocation_amount numeric,
  p_allocation_asset_id uuid,
  p_risk_config jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_trading_configs
  set strategy_code = btrim(p_strategy_code),
      risk_level = p_risk_level,
      allocation_amount = p_allocation_amount,
      allocation_asset_id = p_allocation_asset_id,
      risk_config = coalesce(p_risk_config, '{}'::jsonb)
  where id = p_config_id and user_id = auth.uid() and status = 'inactive';
  if not found then
    raise exception 'inactive AI trading config not found';
  end if;
  insert into public.ai_trading_events (config_id, event_type, payload)
  values (p_config_id, 'updated', jsonb_build_object('strategy_code', btrim(p_strategy_code)));
end;
$$;

create or replace function public.set_ai_trading_status(
  p_config_id uuid,
  p_status public.ai_config_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current public.ai_config_status;
begin
  select status into v_current
  from public.ai_trading_configs
  where id = p_config_id and user_id = auth.uid()
  for update;
  if not found then
    raise exception 'AI trading config not found';
  end if;
  if p_status = 'inactive' or v_current = 'stopped' then
    raise exception 'status change is not allowed';
  end if;
  if v_current = 'inactive' and p_status <> 'active' then
    raise exception 'an inactive config can only be activated';
  end if;
  if v_current = 'active' and p_status not in ('paused', 'stopped') then
    raise exception 'an active config can be paused or stopped';
  end if;
  if v_current = 'paused' and p_status not in ('active', 'stopped') then
    raise exception 'a paused config can be resumed or stopped';
  end if;

  update public.ai_trading_configs
  set status = p_status,
      activated_at = case when p_status = 'active' and activated_at is null then now() else activated_at end,
      paused_at = case when p_status = 'paused' then now() else paused_at end,
      stopped_at = case when p_status = 'stopped' then now() else stopped_at end
  where id = p_config_id;

  insert into public.ai_trading_events (config_id, event_type, payload)
  values (p_config_id, 'status', jsonb_build_object('from', v_current, 'to', p_status));
end;
$$;

create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notifications
  set read_at = now()
  where id = p_notification_id and user_id = auth.uid() and read_at is null;
end;
$$;

create or replace function public.protect_notification_columns()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.kind is distinct from old.kind
    or new.title is distinct from old.title
    or new.body is distinct from old.body
    or new.reference_type is distinct from old.reference_type
    or new.reference_id is distinct from old.reference_id
    or new.created_at is distinct from old.created_at then
    raise exception 'notification content is not editable';
  end if;
  if old.read_at is not null and new.read_at is distinct from old.read_at then
    raise exception 'notification is already read';
  end if;
  return new;
end;
$$;

create trigger notifications_protect_columns
  before update on public.notifications
  for each row execute function public.protect_notification_columns();

-- ---------------------------------------------------------------------------
-- Privileges. Browser roles cannot post journals or write audit rows directly.
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant select on public.assets, public.networks, public.asset_networks, public.instruments to anon;

revoke all on function public.post_journal(text, text, uuid, text, jsonb) from public;
revoke all on function public.write_audit(text, text, uuid, jsonb) from public;
revoke all on function public.write_notification(uuid, text, text, text, text, uuid) from public;
revoke all on function public.create_user_account(uuid, public.account_kind, text) from public;
revoke all on function public.release_withdrawal_hold(public.withdrawals) from public;
revoke all on function public.platform_ledger_account(public.ledger_account_kind) from public;
revoke all on function public.user_ledger_account(uuid, public.ledger_account_kind) from public;
revoke all on function public.funding_account(uuid) from public;
revoke all on function public.require_permission(text) from public;

revoke all on function public.has_permission(text) from public, anon;
grant execute on function public.has_permission(text) to authenticated;

grant execute on function public.admin_adjust_balance(uuid, uuid, public.adjustment_direction, numeric, text) to authenticated;
grant execute on function public.create_deposit(uuid, uuid, numeric, text, uuid) to authenticated;
grant execute on function public.cancel_deposit(uuid) to authenticated;
grant execute on function public.review_deposit(uuid, text, text, text, integer) to authenticated;
grant execute on function public.request_withdrawal(uuid, uuid, text, numeric) to authenticated;
grant execute on function public.cancel_withdrawal(uuid) to authenticated;
grant execute on function public.review_withdrawal(uuid, text, text, text) to authenticated;
grant execute on function public.submit_kyc(text, text, text, text) to authenticated;
grant execute on function public.review_kyc(uuid, public.kyc_submission_status, text) to authenticated;
grant execute on function public.admin_grant_role(uuid, text) to authenticated;
grant execute on function public.admin_revoke_role(uuid, text) to authenticated;
grant execute on function public.admin_set_deposit_destination(uuid, text, text, boolean) to authenticated;
grant execute on function public.admin_create_professional_trader(text, text, text, public.risk_level, text, text, uuid[], numeric, uuid) to authenticated;
grant execute on function public.admin_set_trader_listing(uuid, public.trader_status, public.trader_visibility) to authenticated;
grant execute on function public.admin_record_master_trade(uuid, public.trade_event_type, public.position_side, uuid, numeric, numeric, timestamptz, uuid) to authenticated;
grant execute on function public.start_copy(uuid, public.allocation_basis, numeric, uuid, integer) to authenticated;
grant execute on function public.pause_copy(uuid) to authenticated;
grant execute on function public.resume_copy(uuid) to authenticated;
grant execute on function public.stop_copy(uuid, text) to authenticated;
grant execute on function public.update_copy_settings(uuid, public.allocation_basis, numeric, uuid, integer) to authenticated;
grant execute on function public.create_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) to authenticated;
grant execute on function public.update_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) to authenticated;
grant execute on function public.set_ai_trading_status(uuid, public.ai_config_status) to authenticated;
grant execute on function public.mark_notification_read(uuid) to authenticated;

revoke all on function public.admin_adjust_balance(uuid, uuid, public.adjustment_direction, numeric, text) from public, anon;
revoke all on function public.create_deposit(uuid, uuid, numeric, text, uuid) from public, anon;
revoke all on function public.cancel_deposit(uuid) from public, anon;
revoke all on function public.review_deposit(uuid, text, text, text, integer) from public, anon;
revoke all on function public.request_withdrawal(uuid, uuid, text, numeric) from public, anon;
revoke all on function public.cancel_withdrawal(uuid) from public, anon;
revoke all on function public.review_withdrawal(uuid, text, text, text) from public, anon;
revoke all on function public.submit_kyc(text, text, text, text) from public, anon;
revoke all on function public.review_kyc(uuid, public.kyc_submission_status, text) from public, anon;
revoke all on function public.admin_grant_role(uuid, text) from public, anon;
revoke all on function public.admin_revoke_role(uuid, text) from public, anon;
revoke all on function public.admin_set_deposit_destination(uuid, text, text, boolean) from public, anon;
revoke all on function public.admin_create_professional_trader(text, text, text, public.risk_level, text, text, uuid[], numeric, uuid) from public, anon;
revoke all on function public.admin_set_trader_listing(uuid, public.trader_status, public.trader_visibility) from public, anon;
revoke all on function public.admin_record_master_trade(uuid, public.trade_event_type, public.position_side, uuid, numeric, numeric, timestamptz, uuid) from public, anon;
revoke all on function public.start_copy(uuid, public.allocation_basis, numeric, uuid, integer) from public, anon;
revoke all on function public.pause_copy(uuid) from public, anon;
revoke all on function public.resume_copy(uuid) from public, anon;
revoke all on function public.stop_copy(uuid, text) from public, anon;
revoke all on function public.update_copy_settings(uuid, public.allocation_basis, numeric, uuid, integer) from public, anon;
revoke all on function public.create_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) from public, anon;
revoke all on function public.update_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) from public, anon;
revoke all on function public.set_ai_trading_status(uuid, public.ai_config_status) from public, anon;
revoke all on function public.mark_notification_read(uuid) from public, anon;

grant execute on function public.admin_adjust_balance(uuid, uuid, public.adjustment_direction, numeric, text) to authenticated;
grant execute on function public.create_deposit(uuid, uuid, numeric, text, uuid) to authenticated;
grant execute on function public.cancel_deposit(uuid) to authenticated;
grant execute on function public.review_deposit(uuid, text, text, text, integer) to authenticated;
grant execute on function public.request_withdrawal(uuid, uuid, text, numeric) to authenticated;
grant execute on function public.cancel_withdrawal(uuid) to authenticated;
grant execute on function public.review_withdrawal(uuid, text, text, text) to authenticated;
grant execute on function public.submit_kyc(text, text, text, text) to authenticated;
grant execute on function public.review_kyc(uuid, public.kyc_submission_status, text) to authenticated;
grant execute on function public.admin_grant_role(uuid, text) to authenticated;
grant execute on function public.admin_revoke_role(uuid, text) to authenticated;
grant execute on function public.admin_set_deposit_destination(uuid, text, text, boolean) to authenticated;
grant execute on function public.admin_create_professional_trader(text, text, text, public.risk_level, text, text, uuid[], numeric, uuid) to authenticated;
grant execute on function public.admin_set_trader_listing(uuid, public.trader_status, public.trader_visibility) to authenticated;
grant execute on function public.admin_record_master_trade(uuid, public.trade_event_type, public.position_side, uuid, numeric, numeric, timestamptz, uuid) to authenticated;
grant execute on function public.start_copy(uuid, public.allocation_basis, numeric, uuid, integer) to authenticated;
grant execute on function public.pause_copy(uuid) to authenticated;
grant execute on function public.resume_copy(uuid) to authenticated;
grant execute on function public.stop_copy(uuid, text) to authenticated;
grant execute on function public.update_copy_settings(uuid, public.allocation_basis, numeric, uuid, integer) to authenticated;
grant execute on function public.create_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) to authenticated;
grant execute on function public.update_ai_trading_config(uuid, text, public.risk_level, numeric, uuid, jsonb) to authenticated;
grant execute on function public.set_ai_trading_status(uuid, public.ai_config_status) to authenticated;
grant execute on function public.mark_notification_read(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.assets enable row level security;
alter table public.networks enable row level security;
alter table public.asset_networks enable row level security;
alter table public.instruments enable row level security;
alter table public.deposit_destinations enable row level security;
alter table public.accounts enable row level security;
alter table public.ledger_accounts enable row level security;
alter table public.ledger_transactions enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.account_balances enable row level security;
alter table public.balance_adjustments enable row level security;
alter table public.deposits enable row level security;
alter table public.withdrawals enable row level security;
alter table public.kyc_submissions enable row level security;
alter table public.kyc_reviews enable row level security;
alter table public.professional_traders enable row level security;
alter table public.professional_trader_strategies enable row level security;
alter table public.professional_trader_assets enable row level security;
alter table public.professional_trader_accounts enable row level security;
alter table public.professional_trader_positions enable row level security;
alter table public.professional_trader_trade_events enable row level security;
alter table public.professional_trader_performance_snapshots enable row level security;
alter table public.copy_relationships enable row level security;
alter table public.copy_settings enable row level security;
alter table public.copy_setting_revisions enable row level security;
alter table public.copy_positions enable row level security;
alter table public.copy_trade_events enable row level security;
alter table public.ai_trading_configs enable row level security;
alter table public.ai_positions enable row level security;
alter table public.ai_trading_events enable row level security;
alter table public.ai_performance_snapshots enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_permission('users.read'));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy roles_select on public.roles
  for select to authenticated
  using (true);

create policy permissions_select on public.permissions
  for select to authenticated
  using (public.has_permission('roles.manage') or public.has_permission('audit.read'));

create policy role_permissions_select on public.role_permissions
  for select to authenticated
  using (public.has_permission('roles.manage') or public.has_permission('audit.read'));

create policy user_roles_select on public.user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('roles.manage'));

create policy catalog_assets_public on public.assets
  for select to anon
  using (is_active);

create policy catalog_assets_auth on public.assets
  for select to authenticated
  using (is_active or public.has_permission('assets.manage'));

create policy catalog_networks_public on public.networks
  for select to anon
  using (is_active);

create policy catalog_networks_auth on public.networks
  for select to authenticated
  using (is_active or public.has_permission('assets.manage'));

create policy catalog_asset_networks on public.asset_networks
  for select to anon, authenticated
  using (true);

create policy catalog_instruments_public on public.instruments
  for select to anon
  using (is_active);

create policy catalog_instruments_auth on public.instruments
  for select to authenticated
  using (is_active or public.has_permission('assets.manage'));

create policy destinations_select on public.deposit_destinations
  for select to authenticated
  using (
    (is_active and address is not null)
    or public.has_permission('assets.manage')
  );

create policy accounts_select on public.accounts
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('users.read'));

create policy ledger_accounts_select on public.ledger_accounts
  for select to authenticated
  using (
    owner_user_id = auth.uid()
    or account_id is null
    or public.has_permission('users.read')
  );

create policy ledger_tx_select on public.ledger_transactions
  for select to authenticated
  using (
    created_by = auth.uid()
    or public.has_permission('audit.read')
  );

create policy ledger_entries_select on public.ledger_entries
  for select to authenticated
  using (
    public.has_permission('audit.read')
    or exists (
      select 1
      from public.ledger_accounts la
      where la.id = ledger_account_id
        and la.owner_user_id = auth.uid()
    )
  );

create policy balances_select on public.account_balances
  for select to authenticated
  using (
    public.has_permission('users.read')
    or exists (
      select 1 from public.accounts a
      where a.id = account_id and a.user_id = auth.uid()
    )
  );

create policy adjustments_select on public.balance_adjustments
  for select to authenticated
  using (user_id = auth.uid() or admin_id = auth.uid() or public.has_permission('audit.read'));

create policy deposits_select on public.deposits
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('deposits.review'));

create policy withdrawals_select on public.withdrawals
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('withdrawals.review'));

create policy kyc_submissions_select on public.kyc_submissions
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('kyc.review'));

create policy kyc_reviews_select on public.kyc_reviews
  for select to authenticated
  using (
    public.has_permission('kyc.review')
    or exists (
      select 1 from public.kyc_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );

create policy traders_select on public.professional_traders
  for select to authenticated
  using (
    (status = 'active' and visibility = 'listed')
    or public.has_permission('traders.manage')
  );

create policy trader_strategies_select on public.professional_trader_strategies
  for select to authenticated
  using (
    public.has_permission('traders.manage')
    or exists (
      select 1 from public.professional_traders t
      where t.id = professional_trader_id
        and t.status = 'active'
        and t.visibility = 'listed'
    )
  );

create policy trader_assets_select on public.professional_trader_assets
  for select to authenticated
  using (
    exists (
      select 1
      from public.professional_trader_strategies s
      join public.professional_traders t on t.id = s.professional_trader_id
      where s.id = strategy_id
        and (
          public.has_permission('traders.manage')
          or (t.status = 'active' and t.visibility = 'listed')
        )
    )
  );

create policy trader_accounts_select on public.professional_trader_accounts
  for select to authenticated
  using (
    public.has_permission('traders.manage')
    or exists (
      select 1 from public.professional_traders t
      where t.id = professional_trader_id
        and t.status = 'active'
        and t.visibility = 'listed'
    )
  );

create policy master_positions_select on public.professional_trader_positions
  for select to authenticated
  using (
    public.has_permission('traders.manage')
    or exists (
      select 1
      from public.professional_trader_accounts a
      join public.professional_traders t on t.id = a.professional_trader_id
      where a.id = professional_trader_account_id
        and t.status = 'active'
        and t.visibility = 'listed'
    )
  );

create policy master_events_select on public.professional_trader_trade_events
  for select to authenticated
  using (
    public.has_permission('traders.manage')
    or exists (
      select 1
      from public.professional_trader_accounts a
      join public.professional_traders t on t.id = a.professional_trader_id
      where a.id = professional_trader_account_id
        and t.status = 'active'
        and t.visibility = 'listed'
    )
  );

create policy trader_snapshots_select on public.professional_trader_performance_snapshots
  for select to authenticated
  using (
    public.has_permission('traders.manage')
    or exists (
      select 1
      from public.professional_trader_accounts a
      join public.professional_traders t on t.id = a.professional_trader_id
      where a.id = professional_trader_account_id
        and t.status = 'active'
        and t.visibility = 'listed'
    )
  );

create policy copy_rel_select on public.copy_relationships
  for select to authenticated
  using (follower_user_id = auth.uid() or public.has_permission('traders.manage'));

create policy copy_settings_select on public.copy_settings
  for select to authenticated
  using (
    exists (
      select 1 from public.copy_relationships r
      where r.id = copy_relationship_id
        and (r.follower_user_id = auth.uid() or public.has_permission('traders.manage'))
    )
  );

create policy copy_revisions_select on public.copy_setting_revisions
  for select to authenticated
  using (
    exists (
      select 1 from public.copy_relationships r
      where r.id = copy_relationship_id
        and (r.follower_user_id = auth.uid() or public.has_permission('traders.manage'))
    )
  );

create policy copy_positions_select on public.copy_positions
  for select to authenticated
  using (
    exists (
      select 1 from public.copy_relationships r
      where r.id = copy_relationship_id
        and (r.follower_user_id = auth.uid() or public.has_permission('traders.manage'))
    )
  );

create policy copy_events_select on public.copy_trade_events
  for select to authenticated
  using (follower_user_id = auth.uid() or public.has_permission('traders.manage'));

create policy ai_configs_select on public.ai_trading_configs
  for select to authenticated
  using (user_id = auth.uid() or public.has_permission('users.read'));

create policy ai_positions_select on public.ai_positions
  for select to authenticated
  using (
    exists (
      select 1 from public.ai_trading_configs c
      where c.id = config_id
        and (c.user_id = auth.uid() or public.has_permission('users.read'))
    )
  );

create policy ai_events_select on public.ai_trading_events
  for select to authenticated
  using (
    exists (
      select 1 from public.ai_trading_configs c
      where c.id = config_id
        and (c.user_id = auth.uid() or public.has_permission('users.read'))
    )
  );

create policy ai_snapshots_select on public.ai_performance_snapshots
  for select to authenticated
  using (
    exists (
      select 1 from public.ai_trading_configs c
      where c.id = config_id
        and (c.user_id = auth.uid() or public.has_permission('users.read'))
    )
  );

create policy notifications_select on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

create policy notifications_mark_read on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy audit_select on public.audit_logs
  for select to authenticated
  using (public.has_permission('audit.read') or actor_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Private KYC documents
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy kyc_documents_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy kyc_documents_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy kyc_documents_select_reviewer on storage.objects
  for select to authenticated
  using (
    bucket_id = 'kyc-documents'
    and public.has_permission('kyc.review')
  );

create policy kyc_documents_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
    and not exists (
      select 1
      from public.kyc_submissions s
      where s.user_id = auth.uid()
        and s.document_storage_path = name
        and s.status in ('pending', 'verified')
    )
  );
