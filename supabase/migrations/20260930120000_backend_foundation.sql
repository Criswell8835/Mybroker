-- Backend foundation. Marketing fixtures in lib/ are not part of this schema.
-- No deposit addresses, chain transactions, or professional traders are seeded.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.account_status as enum ('active', 'suspended', 'closed');
create type public.account_kind as enum ('funding', 'trading', 'copy');
create type public.kyc_status as enum (
  'not_started',
  'pending',
  'verified',
  'rejected',
  'resubmission_required'
);
create type public.kyc_submission_status as enum (
  'pending',
  'verified',
  'rejected',
  'resubmission_required'
);
create type public.asset_kind as enum ('crypto', 'fiat', 'stable');
create type public.ledger_direction as enum ('debit', 'credit');
create type public.ledger_account_kind as enum (
  'user_available',
  'user_held',
  'treasury',
  'deposit_clearing',
  'withdrawal_clearing',
  'adjustment'
);
create type public.adjustment_direction as enum ('credit', 'debit');
create type public.deposit_status as enum (
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'expired'
);
create type public.withdrawal_status as enum (
  'pending',
  'approved',
  'rejected',
  'cancelled'
);
create type public.trader_status as enum ('draft', 'active', 'suspended', 'retired');
create type public.trader_visibility as enum ('hidden', 'listed');
create type public.risk_level as enum ('low', 'moderate', 'higher');
create type public.position_side as enum ('long', 'short');
create type public.position_status as enum ('open', 'closed');
create type public.trade_event_type as enum (
  'open',
  'increase',
  'decrease',
  'partial_close',
  'close'
);
create type public.trade_event_source as enum ('manual', 'engine', 'exchange');
create type public.copy_status as enum ('active', 'paused', 'stopped');
create type public.allocation_basis as enum ('fixed_amount', 'master_ratio');
create type public.copy_event_status as enum ('applied', 'skipped', 'failed');
create type public.ai_config_status as enum ('inactive', 'active', 'paused', 'stopped');

-- ---------------------------------------------------------------------------
-- Identity and access
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  status public.account_status not null default 'active',
  kyc_status public.kyc_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_len check (char_length(btrim(display_name)) between 1 and 80)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id uuid not null references public.roles (id),
  granted_by uuid references auth.users (id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index user_roles_one_active
  on public.user_roles (user_id, role_id)
  where revoked_at is null;

-- ---------------------------------------------------------------------------
-- Assets. Catalog only — no wallet addresses.
-- ---------------------------------------------------------------------------

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  name text not null,
  kind public.asset_kind not null,
  display_scale integer not null default 8,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint assets_symbol_len check (char_length(symbol) between 2 and 12),
  constraint assets_scale_range check (display_scale between 0 and 18)
);

create table public.networks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.asset_networks (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets (id),
  network_id uuid not null references public.networks (id),
  deposit_enabled boolean not null default false,
  withdrawal_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  unique (asset_id, network_id)
);

create table public.instruments (
  id uuid primary key default gen_random_uuid(),
  base_asset_id uuid not null references public.assets (id),
  quote_asset_id uuid not null references public.assets (id),
  symbol text not null unique,
  venue text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint instruments_distinct_legs check (base_asset_id <> quote_asset_id)
);

create table public.deposit_destinations (
  id uuid primary key default gen_random_uuid(),
  asset_network_id uuid not null references public.asset_networks (id),
  label text not null,
  address text,
  is_active boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deposit_destinations_address_len check (
    address is null or char_length(btrim(address)) between 10 and 256
  )
);

create unique index deposit_destinations_address_unique
  on public.deposit_destinations (asset_network_id, address)
  where address is not null;

-- ---------------------------------------------------------------------------
-- Accounts and ledger
-- ---------------------------------------------------------------------------

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  kind public.account_kind not null,
  label text,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now()
);

create index accounts_user_kind_idx on public.accounts (user_id, kind);

create table public.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users (id) on delete restrict,
  account_id uuid references public.accounts (id) on delete restrict,
  code text not null unique,
  kind public.ledger_account_kind not null,
  created_at timestamptz not null default now(),
  constraint ledger_accounts_shape check (
    (
      kind in ('user_available', 'user_held')
      and account_id is not null
      and owner_user_id is not null
    )
    or (
      kind in ('treasury', 'deposit_clearing', 'withdrawal_clearing', 'adjustment')
      and account_id is null
    )
  )
);

create table public.ledger_transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  reference_type text,
  reference_id uuid,
  description text not null default '',
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index ledger_transactions_reference_idx
  on public.ledger_transactions (reference_type, reference_id);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.ledger_transactions (id) on delete restrict,
  ledger_account_id uuid not null references public.ledger_accounts (id) on delete restrict,
  asset_id uuid not null references public.assets (id),
  direction public.ledger_direction not null,
  amount numeric(38, 18) not null,
  created_at timestamptz not null default now(),
  constraint ledger_entries_amount_positive check (amount > 0)
);

create index ledger_entries_transaction_idx on public.ledger_entries (transaction_id);
create index ledger_entries_account_asset_idx
  on public.ledger_entries (ledger_account_id, asset_id);

create table public.account_balances (
  account_id uuid not null references public.accounts (id) on delete restrict,
  asset_id uuid not null references public.assets (id),
  available numeric(38, 18) not null default 0,
  held numeric(38, 18) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (account_id, asset_id),
  constraint account_balances_nonnegative check (available >= 0 and held >= 0)
);

create table public.balance_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  account_id uuid not null references public.accounts (id) on delete restrict,
  asset_id uuid not null references public.assets (id),
  direction public.adjustment_direction not null,
  amount numeric(38, 18) not null,
  reason text not null,
  admin_id uuid not null references auth.users (id),
  ledger_transaction_id uuid not null unique references public.ledger_transactions (id),
  created_at timestamptz not null default now(),
  constraint balance_adjustments_amount_positive check (amount > 0),
  constraint balance_adjustments_reason_len check (char_length(btrim(reason)) between 3 and 500)
);

-- ---------------------------------------------------------------------------
-- Deposits and withdrawals
-- ---------------------------------------------------------------------------

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  account_id uuid not null references public.accounts (id) on delete restrict,
  asset_id uuid not null references public.assets (id),
  network_id uuid not null references public.networks (id),
  destination_id uuid references public.deposit_destinations (id),
  amount numeric(38, 18) not null,
  status public.deposit_status not null default 'pending',
  reference text,
  tx_hash text,
  confirmations integer,
  required_confirmations integer,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  rejection_reason text,
  ledger_transaction_id uuid unique references public.ledger_transactions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deposits_amount_positive check (amount > 0),
  constraint deposits_tx_hash_len check (
    tx_hash is null or char_length(btrim(tx_hash)) between 8 and 128
  ),
  constraint deposits_confirmations_nonnegative check (
    confirmations is null or confirmations >= 0
  ),
  constraint deposits_rejection_reason check (
    status <> 'rejected' or char_length(btrim(coalesce(rejection_reason, ''))) >= 3
  )
);

create index deposits_user_status_idx on public.deposits (user_id, status);
create unique index deposits_tx_hash_unique
  on public.deposits (tx_hash)
  where tx_hash is not null;

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  account_id uuid not null references public.accounts (id) on delete restrict,
  asset_id uuid not null references public.assets (id),
  network_id uuid not null references public.networks (id),
  destination_address text not null,
  amount numeric(38, 18) not null,
  status public.withdrawal_status not null default 'pending',
  tx_hash text,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  rejection_reason text,
  ledger_lock_transaction_id uuid not null unique references public.ledger_transactions (id),
  ledger_settlement_transaction_id uuid unique references public.ledger_transactions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint withdrawals_amount_positive check (amount > 0),
  constraint withdrawals_address_len check (char_length(btrim(destination_address)) between 10 and 256),
  constraint withdrawals_tx_hash_len check (
    tx_hash is null or char_length(btrim(tx_hash)) between 8 and 128
  ),
  constraint withdrawals_rejection_reason check (
    status <> 'rejected' or char_length(btrim(coalesce(rejection_reason, ''))) >= 3
  )
);

create index withdrawals_user_status_idx on public.withdrawals (user_id, status);
create unique index withdrawals_tx_hash_unique
  on public.withdrawals (tx_hash)
  where tx_hash is not null;

-- ---------------------------------------------------------------------------
-- KYC
-- ---------------------------------------------------------------------------

create table public.kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  status public.kyc_submission_status not null default 'pending',
  legal_name text not null,
  country text not null,
  document_type text not null,
  document_storage_path text not null,
  submitted_at timestamptz not null default now(),
  constraint kyc_legal_name_len check (char_length(btrim(legal_name)) between 2 and 120),
  constraint kyc_country_len check (char_length(country) between 2 and 2),
  constraint kyc_document_type_len check (char_length(btrim(document_type)) between 2 and 40),
  constraint kyc_path_len check (char_length(document_storage_path) between 3 and 512)
);

create unique index kyc_one_pending
  on public.kyc_submissions (user_id)
  where status = 'pending';

create table public.kyc_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.kyc_submissions (id) on delete restrict,
  reviewer_id uuid not null references auth.users (id),
  decision public.kyc_submission_status not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint kyc_reviews_not_pending check (decision <> 'pending'),
  constraint kyc_reviews_reason check (
    decision = 'verified' or char_length(btrim(coalesce(reason, ''))) >= 3
  )
);

-- ---------------------------------------------------------------------------
-- Professional copy trading. Empty until an admin creates a trader.
-- ---------------------------------------------------------------------------

create table public.professional_traders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  avatar_storage_path text,
  biography text not null default '',
  risk_level public.risk_level not null default 'moderate',
  status public.trader_status not null default 'draft',
  visibility public.trader_visibility not null default 'hidden',
  min_allocation_amount numeric(38, 18),
  min_allocation_asset_id uuid references public.assets (id),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_traders_slug_len check (char_length(slug) between 2 and 64),
  constraint professional_traders_name_len check (char_length(btrim(display_name)) between 1 and 80),
  constraint professional_traders_listed_active check (
    visibility = 'hidden' or status = 'active'
  ),
  constraint professional_traders_min_allocation check (
    (
      min_allocation_amount is null
      and min_allocation_asset_id is null
    )
    or (
      min_allocation_amount > 0
      and min_allocation_asset_id is not null
    )
  )
);

create table public.professional_trader_strategies (
  id uuid primary key default gen_random_uuid(),
  professional_trader_id uuid not null references public.professional_traders (id) on delete restrict,
  name text not null,
  description text not null default '',
  is_current boolean not null default false,
  effective_from timestamptz not null default now(),
  effective_to timestamptz
);

create unique index professional_trader_one_current_strategy
  on public.professional_trader_strategies (professional_trader_id)
  where is_current;

create table public.professional_trader_assets (
  strategy_id uuid not null references public.professional_trader_strategies (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  created_at timestamptz not null default now(),
  primary key (strategy_id, instrument_id)
);

create table public.professional_trader_accounts (
  id uuid primary key default gen_random_uuid(),
  professional_trader_id uuid not null references public.professional_traders (id) on delete restrict,
  strategy_id uuid not null references public.professional_trader_strategies (id) on delete restrict,
  label text not null default 'Primary',
  is_primary boolean not null default false,
  status public.account_status not null default 'active',
  external_account_ref text,
  created_at timestamptz not null default now()
);

create unique index professional_trader_one_primary_account
  on public.professional_trader_accounts (professional_trader_id)
  where is_primary;

create table public.professional_trader_positions (
  id uuid primary key default gen_random_uuid(),
  professional_trader_account_id uuid not null references public.professional_trader_accounts (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  side public.position_side not null,
  status public.position_status not null default 'open',
  quantity numeric(38, 18) not null,
  entry_price numeric(38, 18),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint master_position_quantity check (
    (status = 'open' and quantity > 0 and closed_at is null)
    or (status = 'closed' and quantity = 0)
  )
);

create index master_positions_account_idx
  on public.professional_trader_positions (professional_trader_account_id, status);

create table public.professional_trader_trade_events (
  id uuid primary key default gen_random_uuid(),
  professional_trader_account_id uuid not null references public.professional_trader_accounts (id) on delete restrict,
  position_id uuid not null references public.professional_trader_positions (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  event_type public.trade_event_type not null,
  side public.position_side not null,
  quantity numeric(38, 18) not null,
  price numeric(38, 18),
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  source public.trade_event_source not null default 'manual',
  external_trade_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id),
  constraint master_event_quantity_positive check (quantity > 0)
);

create index master_events_account_time_idx
  on public.professional_trader_trade_events (professional_trader_account_id, occurred_at);
create unique index master_events_external_ref
  on public.professional_trader_trade_events (source, external_trade_ref)
  where external_trade_ref is not null;

create table public.professional_trader_performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  professional_trader_account_id uuid not null references public.professional_trader_accounts (id) on delete restrict,
  as_of timestamptz not null,
  equity numeric(38, 18),
  return_bps integer,
  drawdown_bps integer,
  created_at timestamptz not null default now(),
  unique (professional_trader_account_id, as_of)
);

create table public.copy_relationships (
  id uuid primary key default gen_random_uuid(),
  follower_user_id uuid not null references auth.users (id) on delete restrict,
  professional_trader_id uuid not null references public.professional_traders (id) on delete restrict,
  professional_trader_account_id uuid not null references public.professional_trader_accounts (id) on delete restrict,
  follower_account_id uuid not null references public.accounts (id) on delete restrict,
  status public.copy_status not null default 'active',
  started_at timestamptz not null default now(),
  paused_at timestamptz,
  stopped_at timestamptz,
  stopped_reason text,
  ledger_hold_transaction_id uuid references public.ledger_transactions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index copy_relationships_one_open
  on public.copy_relationships (follower_user_id, professional_trader_account_id)
  where status <> 'stopped';

create table public.copy_settings (
  id uuid primary key default gen_random_uuid(),
  copy_relationship_id uuid not null unique references public.copy_relationships (id) on delete restrict,
  allocation_basis public.allocation_basis not null,
  allocation_amount numeric(38, 18),
  allocation_asset_id uuid references public.assets (id),
  master_ratio_bps integer,
  copy_existing_positions boolean not null default false,
  risk_config jsonb not null default '{}'::jsonb,
  effective_from timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint copy_settings_shape check (
    (
      allocation_basis = 'fixed_amount'
      and allocation_amount > 0
      and allocation_asset_id is not null
      and master_ratio_bps is null
    )
    or (
      allocation_basis = 'master_ratio'
      and master_ratio_bps > 0
      and master_ratio_bps <= 10000
      and allocation_amount is null
    )
  )
);

create table public.copy_setting_revisions (
  id uuid primary key default gen_random_uuid(),
  copy_relationship_id uuid not null references public.copy_relationships (id) on delete restrict,
  allocation_basis public.allocation_basis not null,
  allocation_amount numeric(38, 18),
  allocation_asset_id uuid references public.assets (id),
  master_ratio_bps integer,
  copy_existing_positions boolean not null,
  risk_config jsonb not null,
  effective_from timestamptz not null,
  recorded_at timestamptz not null default now()
);

create table public.copy_positions (
  id uuid primary key default gen_random_uuid(),
  copy_relationship_id uuid not null references public.copy_relationships (id) on delete restrict,
  professional_trader_position_id uuid not null references public.professional_trader_positions (id) on delete restrict,
  follower_account_id uuid not null references public.accounts (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  side public.position_side not null,
  status public.position_status not null default 'open',
  quantity numeric(38, 18) not null,
  entry_price numeric(38, 18),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  unique (copy_relationship_id, professional_trader_position_id),
  constraint copy_position_quantity check (
    (status = 'open' and quantity > 0 and closed_at is null)
    or (status = 'closed' and quantity = 0)
  )
);

create table public.copy_trade_events (
  id uuid primary key default gen_random_uuid(),
  copy_relationship_id uuid not null references public.copy_relationships (id) on delete restrict,
  copy_position_id uuid references public.copy_positions (id) on delete restrict,
  professional_trader_trade_event_id uuid not null references public.professional_trader_trade_events (id) on delete restrict,
  follower_user_id uuid not null references auth.users (id) on delete restrict,
  event_type public.trade_event_type not null,
  side public.position_side not null,
  quantity numeric(38, 18) not null,
  price numeric(38, 18),
  application_status public.copy_event_status not null,
  skip_reason text,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  unique (copy_relationship_id, professional_trader_trade_event_id),
  constraint copy_event_quantity_positive check (quantity > 0)
);

create index copy_events_follower_idx
  on public.copy_trade_events (follower_user_id, occurred_at);

-- ---------------------------------------------------------------------------
-- AI trading records. No execution engine.
-- ---------------------------------------------------------------------------

create table public.ai_trading_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  account_id uuid not null references public.accounts (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  strategy_code text not null,
  risk_level public.risk_level not null default 'moderate',
  risk_config jsonb not null default '{}'::jsonb,
  allocation_amount numeric(38, 18) not null,
  allocation_asset_id uuid not null references public.assets (id),
  status public.ai_config_status not null default 'inactive',
  activated_at timestamptz,
  paused_at timestamptz,
  stopped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_allocation_positive check (allocation_amount > 0),
  constraint ai_strategy_len check (char_length(btrim(strategy_code)) between 2 and 64)
);

create index ai_configs_user_idx on public.ai_trading_configs (user_id, status);

create table public.ai_positions (
  id uuid primary key default gen_random_uuid(),
  config_id uuid not null references public.ai_trading_configs (id) on delete restrict,
  instrument_id uuid not null references public.instruments (id),
  side public.position_side not null,
  status public.position_status not null default 'open',
  quantity numeric(38, 18) not null,
  entry_price numeric(38, 18),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint ai_position_quantity check (
    (status = 'open' and quantity > 0 and closed_at is null)
    or (status = 'closed' and quantity = 0)
  )
);

create table public.ai_trading_events (
  id uuid primary key default gen_random_uuid(),
  config_id uuid not null references public.ai_trading_configs (id) on delete restrict,
  position_id uuid references public.ai_positions (id) on delete restrict,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index ai_events_config_idx on public.ai_trading_events (config_id, created_at);

create table public.ai_performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  config_id uuid not null references public.ai_trading_configs (id) on delete restrict,
  as_of timestamptz not null,
  equity numeric(38, 18),
  pnl numeric(38, 18),
  created_at timestamptz not null default now(),
  unique (config_id, as_of)
);

-- ---------------------------------------------------------------------------
-- Notifications and audit. Separate from homepage activity fixtures.
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Append-only guards
-- ---------------------------------------------------------------------------

create or replace function public.reject_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception '% is append-only', tg_table_name;
end;
$$;

create trigger ledger_transactions_append_only
  before update or delete on public.ledger_transactions
  for each row execute function public.reject_mutation();

create trigger ledger_entries_append_only
  before update or delete on public.ledger_entries
  for each row execute function public.reject_mutation();

create trigger balance_adjustments_append_only
  before update or delete on public.balance_adjustments
  for each row execute function public.reject_mutation();

create trigger kyc_reviews_append_only
  before update or delete on public.kyc_reviews
  for each row execute function public.reject_mutation();

create trigger master_events_append_only
  before update or delete on public.professional_trader_trade_events
  for each row execute function public.reject_mutation();

create trigger copy_setting_revisions_append_only
  before update or delete on public.copy_setting_revisions
  for each row execute function public.reject_mutation();

create trigger copy_trade_events_append_only
  before update or delete on public.copy_trade_events
  for each row execute function public.reject_mutation();

create trigger ai_trading_events_append_only
  before update or delete on public.ai_trading_events
  for each row execute function public.reject_mutation();

create trigger audit_logs_append_only
  before update or delete on public.audit_logs
  for each row execute function public.reject_mutation();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger deposits_touch before update on public.deposits
  for each row execute function public.touch_updated_at();
create trigger withdrawals_touch before update on public.withdrawals
  for each row execute function public.touch_updated_at();
create trigger traders_touch before update on public.professional_traders
  for each row execute function public.touch_updated_at();
create trigger copy_relationships_touch before update on public.copy_relationships
  for each row execute function public.touch_updated_at();
create trigger copy_settings_touch before update on public.copy_settings
  for each row execute function public.touch_updated_at();
create trigger ai_configs_touch before update on public.ai_trading_configs
  for each row execute function public.touch_updated_at();
create trigger deposit_destinations_touch before update on public.deposit_destinations
  for each row execute function public.touch_updated_at();

create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.trusted_profile_write', true) is distinct from 'on' then
    if new.kyc_status is distinct from old.kyc_status
      or new.status is distinct from old.status
      or new.id is distinct from old.id
      or new.created_at is distinct from old.created_at then
      raise exception 'profile field is not user-editable';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ---------------------------------------------------------------------------
-- Catalog seed. No destinations, balances, or traders.
-- ---------------------------------------------------------------------------

insert into public.roles (key, name) values
  ('user', 'User'),
  ('admin', 'Admin');

insert into public.permissions (key, description) values
  ('users.read', 'Read user profiles and accounts'),
  ('balances.adjust', 'Credit or debit a user balance'),
  ('deposits.review', 'Approve or reject deposits'),
  ('withdrawals.review', 'Approve or reject withdrawals'),
  ('kyc.review', 'Review KYC submissions'),
  ('traders.manage', 'Manage professional traders'),
  ('trades.record', 'Record master or AI trade events'),
  ('assets.manage', 'Manage assets, networks, and deposit destinations'),
  ('roles.manage', 'Grant or revoke roles'),
  ('audit.read', 'Read the audit log');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'admin';

insert into public.assets (symbol, name, kind, display_scale) values
  ('BTC', 'Bitcoin', 'crypto', 8),
  ('ETH', 'Ethereum', 'crypto', 18),
  ('SOL', 'Solana', 'crypto', 9),
  ('USDT', 'Tether', 'stable', 6);

insert into public.networks (code, name) values
  ('bitcoin', 'Bitcoin'),
  ('ethereum', 'Ethereum'),
  ('solana', 'Solana'),
  ('tron', 'Tron');

insert into public.asset_networks (asset_id, network_id, deposit_enabled, withdrawal_enabled)
select a.id, n.id, true, true
from public.assets a
join public.networks n on (
  (a.symbol = 'BTC' and n.code = 'bitcoin')
  or (a.symbol = 'ETH' and n.code = 'ethereum')
  or (a.symbol = 'SOL' and n.code = 'solana')
  or (a.symbol = 'USDT' and n.code in ('ethereum', 'tron'))
);

insert into public.instruments (base_asset_id, quote_asset_id, symbol)
select base.id, quote.id, base.symbol || '/USDT'
from public.assets base
join public.assets quote on quote.symbol = 'USDT'
where base.symbol in ('BTC', 'ETH', 'SOL');

insert into public.ledger_accounts (code, kind) values
  ('platform:treasury', 'treasury'),
  ('platform:deposit_clearing', 'deposit_clearing'),
  ('platform:withdrawal_clearing', 'withdrawal_clearing'),
  ('platform:adjustment', 'adjustment');
