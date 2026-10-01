export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: { [K in keyof Row]?: Row[K] };
  Update: { [K in keyof Row]?: Row[K] };
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<{
        id: string;
        display_name: string;
        status: Database["public"]["Enums"]["account_status"];
        kyc_status: Database["public"]["Enums"]["kyc_status"];
        created_at: string;
        updated_at: string;
      }>;
      roles: Table<{ id: string; key: string; name: string; created_at: string }>;
      permissions: Table<{ id: string; key: string; description: string; created_at: string }>;
      role_permissions: Table<{ role_id: string; permission_id: string; created_at: string }>;
      user_roles: Table<{
        id: string;
        user_id: string;
        role_id: string;
        granted_by: string | null;
        granted_at: string;
        revoked_at: string | null;
      }>;
      assets: Table<{
        id: string;
        symbol: string;
        name: string;
        kind: Database["public"]["Enums"]["asset_kind"];
        display_scale: number;
        is_active: boolean;
        created_at: string;
      }>;
      networks: Table<{
        id: string;
        code: string;
        name: string;
        is_active: boolean;
        created_at: string;
      }>;
      asset_networks: Table<{
        id: string;
        asset_id: string;
        network_id: string;
        deposit_enabled: boolean;
        withdrawal_enabled: boolean;
        created_at: string;
      }>;
      instruments: Table<{
        id: string;
        base_asset_id: string;
        quote_asset_id: string;
        symbol: string;
        venue: string | null;
        is_active: boolean;
        created_at: string;
      }>;
      deposit_destinations: Table<{
        id: string;
        asset_network_id: string;
        label: string;
        address: string | null;
        is_active: boolean;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      accounts: Table<{
        id: string;
        user_id: string;
        kind: Database["public"]["Enums"]["account_kind"];
        label: string | null;
        status: Database["public"]["Enums"]["account_status"];
        created_at: string;
      }>;
      ledger_accounts: Table<{
        id: string;
        owner_user_id: string | null;
        account_id: string | null;
        code: string;
        kind: Database["public"]["Enums"]["ledger_account_kind"];
        created_at: string;
      }>;
      ledger_transactions: Table<{
        id: string;
        kind: string;
        reference_type: string | null;
        reference_id: string | null;
        description: string;
        created_by: string | null;
        created_at: string;
      }>;
      ledger_entries: Table<{
        id: string;
        transaction_id: string;
        ledger_account_id: string;
        asset_id: string;
        direction: Database["public"]["Enums"]["ledger_direction"];
        amount: number;
        created_at: string;
      }>;
      account_balances: Table<{
        account_id: string;
        asset_id: string;
        available: number;
        held: number;
        updated_at: string;
      }>;
      balance_adjustments: Table<{
        id: string;
        user_id: string;
        account_id: string;
        asset_id: string;
        direction: Database["public"]["Enums"]["adjustment_direction"];
        amount: number;
        reason: string;
        admin_id: string;
        ledger_transaction_id: string;
        created_at: string;
      }>;
      deposits: Table<{
        id: string;
        user_id: string;
        account_id: string;
        asset_id: string;
        network_id: string;
        destination_id: string | null;
        amount: number;
        status: Database["public"]["Enums"]["deposit_status"];
        reference: string | null;
        tx_hash: string | null;
        confirmations: number | null;
        required_confirmations: number | null;
        reviewed_by: string | null;
        reviewed_at: string | null;
        rejection_reason: string | null;
        ledger_transaction_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      withdrawals: Table<{
        id: string;
        user_id: string;
        account_id: string;
        asset_id: string;
        network_id: string;
        destination_address: string;
        amount: number;
        status: Database["public"]["Enums"]["withdrawal_status"];
        tx_hash: string | null;
        reviewed_by: string | null;
        reviewed_at: string | null;
        rejection_reason: string | null;
        ledger_lock_transaction_id: string;
        ledger_settlement_transaction_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      kyc_submissions: Table<{
        id: string;
        user_id: string;
        status: Database["public"]["Enums"]["kyc_submission_status"];
        legal_name: string;
        country: string;
        document_type: string;
        document_storage_path: string;
        submitted_at: string;
      }>;
      kyc_reviews: Table<{
        id: string;
        submission_id: string;
        reviewer_id: string;
        decision: Database["public"]["Enums"]["kyc_submission_status"];
        reason: string | null;
        created_at: string;
      }>;
      professional_traders: Table<{
        id: string;
        slug: string;
        display_name: string;
        avatar_storage_path: string | null;
        biography: string;
        risk_level: Database["public"]["Enums"]["risk_level"];
        status: Database["public"]["Enums"]["trader_status"];
        visibility: Database["public"]["Enums"]["trader_visibility"];
        min_allocation_amount: number | null;
        min_allocation_asset_id: string | null;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      professional_trader_strategies: Table<{
        id: string;
        professional_trader_id: string;
        name: string;
        description: string;
        is_current: boolean;
        effective_from: string;
        effective_to: string | null;
      }>;
      professional_trader_assets: Table<{
        strategy_id: string;
        instrument_id: string;
        created_at: string;
      }>;
      professional_trader_accounts: Table<{
        id: string;
        professional_trader_id: string;
        strategy_id: string;
        label: string;
        is_primary: boolean;
        status: Database["public"]["Enums"]["account_status"];
        external_account_ref: string | null;
        created_at: string;
      }>;
      professional_trader_positions: Table<{
        id: string;
        professional_trader_account_id: string;
        instrument_id: string;
        side: Database["public"]["Enums"]["position_side"];
        status: Database["public"]["Enums"]["position_status"];
        quantity: number;
        entry_price: number | null;
        opened_at: string;
        closed_at: string | null;
      }>;
      professional_trader_trade_events: Table<{
        id: string;
        professional_trader_account_id: string;
        position_id: string;
        instrument_id: string;
        event_type: Database["public"]["Enums"]["trade_event_type"];
        side: Database["public"]["Enums"]["position_side"];
        quantity: number;
        price: number | null;
        occurred_at: string;
        recorded_at: string;
        source: Database["public"]["Enums"]["trade_event_source"];
        external_trade_ref: string | null;
        metadata: Json;
        created_by: string | null;
      }>;
      professional_trader_performance_snapshots: Table<{
        id: string;
        professional_trader_account_id: string;
        as_of: string;
        equity: number | null;
        return_bps: number | null;
        drawdown_bps: number | null;
        created_at: string;
      }>;
      copy_relationships: Table<{
        id: string;
        follower_user_id: string;
        professional_trader_id: string;
        professional_trader_account_id: string;
        follower_account_id: string;
        status: Database["public"]["Enums"]["copy_status"];
        started_at: string;
        paused_at: string | null;
        stopped_at: string | null;
        stopped_reason: string | null;
        ledger_hold_transaction_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      copy_settings: Table<{
        id: string;
        copy_relationship_id: string;
        allocation_basis: Database["public"]["Enums"]["allocation_basis"];
        allocation_amount: number | null;
        allocation_asset_id: string | null;
        master_ratio_bps: number | null;
        copy_existing_positions: boolean;
        risk_config: Json;
        effective_from: string;
        updated_at: string;
      }>;
      copy_setting_revisions: Table<{
        id: string;
        copy_relationship_id: string;
        allocation_basis: Database["public"]["Enums"]["allocation_basis"];
        allocation_amount: number | null;
        allocation_asset_id: string | null;
        master_ratio_bps: number | null;
        copy_existing_positions: boolean;
        risk_config: Json;
        effective_from: string;
        recorded_at: string;
      }>;
      copy_positions: Table<{
        id: string;
        copy_relationship_id: string;
        professional_trader_position_id: string;
        follower_account_id: string;
        instrument_id: string;
        side: Database["public"]["Enums"]["position_side"];
        status: Database["public"]["Enums"]["position_status"];
        quantity: number;
        entry_price: number | null;
        opened_at: string;
        closed_at: string | null;
      }>;
      copy_trade_events: Table<{
        id: string;
        copy_relationship_id: string;
        copy_position_id: string | null;
        professional_trader_trade_event_id: string;
        follower_user_id: string;
        event_type: Database["public"]["Enums"]["trade_event_type"];
        side: Database["public"]["Enums"]["position_side"];
        quantity: number;
        price: number | null;
        application_status: Database["public"]["Enums"]["copy_event_status"];
        skip_reason: string | null;
        occurred_at: string;
        recorded_at: string;
      }>;
      ai_trading_configs: Table<{
        id: string;
        user_id: string;
        account_id: string;
        instrument_id: string;
        strategy_code: string;
        risk_level: Database["public"]["Enums"]["risk_level"];
        risk_config: Json;
        allocation_amount: number;
        allocation_asset_id: string;
        status: Database["public"]["Enums"]["ai_config_status"];
        activated_at: string | null;
        paused_at: string | null;
        stopped_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      ai_positions: Table<{
        id: string;
        config_id: string;
        instrument_id: string;
        side: Database["public"]["Enums"]["position_side"];
        status: Database["public"]["Enums"]["position_status"];
        quantity: number;
        entry_price: number | null;
        opened_at: string;
        closed_at: string | null;
      }>;
      ai_trading_events: Table<{
        id: string;
        config_id: string;
        position_id: string | null;
        event_type: string;
        payload: Json;
        created_at: string;
      }>;
      ai_performance_snapshots: Table<{
        id: string;
        config_id: string;
        as_of: string;
        equity: number | null;
        pnl: number | null;
        created_at: string;
      }>;
      notifications: Table<{
        id: string;
        user_id: string;
        kind: string;
        title: string;
        body: string;
        read_at: string | null;
        reference_type: string | null;
        reference_id: string | null;
        created_at: string;
      }>;
      audit_logs: Table<{
        id: string;
        actor_id: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        metadata: Json;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      has_permission: { Args: { permission_key: string }; Returns: boolean };
      create_deposit: {
        Args: {
          p_asset_id: string;
          p_network_id: string;
          p_amount: number;
          p_reference: string;
          p_destination_id?: string;
        };
        Returns: string;
      };
      cancel_deposit: { Args: { p_deposit_id: string }; Returns: undefined };
      request_withdrawal: {
        Args: {
          p_asset_id: string;
          p_network_id: string;
          p_destination_address: string;
          p_amount: number;
        };
        Returns: string;
      };
      cancel_withdrawal: { Args: { p_withdrawal_id: string }; Returns: undefined };
      submit_kyc: {
        Args: {
          p_legal_name: string;
          p_country: string;
          p_document_type: string;
          p_document_storage_path: string;
        };
        Returns: string;
      };
      start_copy: {
        Args: {
          p_trader_id: string;
          p_allocation_basis: Database["public"]["Enums"]["allocation_basis"];
          p_allocation_amount?: number;
          p_allocation_asset_id?: string;
          p_master_ratio_bps?: number;
        };
        Returns: string;
      };
      pause_copy: { Args: { p_relationship_id: string }; Returns: undefined };
      resume_copy: { Args: { p_relationship_id: string }; Returns: undefined };
      stop_copy: {
        Args: { p_relationship_id: string; p_reason?: string };
        Returns: undefined;
      };
      update_copy_settings: {
        Args: {
          p_relationship_id: string;
          p_allocation_basis: Database["public"]["Enums"]["allocation_basis"];
          p_allocation_amount?: number;
          p_allocation_asset_id?: string;
          p_master_ratio_bps?: number;
        };
        Returns: undefined;
      };
      create_ai_trading_config: {
        Args: {
          p_instrument_id: string;
          p_strategy_code: string;
          p_risk_level: Database["public"]["Enums"]["risk_level"];
          p_allocation_amount: number;
          p_allocation_asset_id: string;
          p_risk_config?: Json;
        };
        Returns: string;
      };
      update_ai_trading_config: {
        Args: {
          p_config_id: string;
          p_strategy_code: string;
          p_risk_level: Database["public"]["Enums"]["risk_level"];
          p_allocation_amount: number;
          p_allocation_asset_id: string;
          p_risk_config?: Json;
        };
        Returns: undefined;
      };
      set_ai_trading_status: {
        Args: {
          p_config_id: string;
          p_status: Database["public"]["Enums"]["ai_config_status"];
        };
        Returns: undefined;
      };
      mark_notification_read: {
        Args: { p_notification_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      account_status: "active" | "suspended" | "closed";
      account_kind: "funding" | "trading" | "copy";
      kyc_status: "not_started" | "pending" | "verified" | "rejected" | "resubmission_required";
      kyc_submission_status: "pending" | "verified" | "rejected" | "resubmission_required";
      asset_kind: "crypto" | "fiat" | "stable";
      ledger_direction: "debit" | "credit";
      ledger_account_kind:
        | "user_available"
        | "user_held"
        | "treasury"
        | "deposit_clearing"
        | "withdrawal_clearing"
        | "adjustment";
      adjustment_direction: "credit" | "debit";
      deposit_status: "pending" | "approved" | "rejected" | "cancelled" | "expired";
      withdrawal_status: "pending" | "approved" | "rejected" | "cancelled";
      trader_status: "draft" | "active" | "suspended" | "retired";
      trader_visibility: "hidden" | "listed";
      risk_level: "low" | "moderate" | "higher";
      position_side: "long" | "short";
      position_status: "open" | "closed";
      trade_event_type: "open" | "increase" | "decrease" | "partial_close" | "close";
      trade_event_source: "manual" | "engine" | "exchange";
      copy_status: "active" | "paused" | "stopped";
      allocation_basis: "fixed_amount" | "master_ratio";
      copy_event_status: "applied" | "skipped" | "failed";
      ai_config_status: "inactive" | "active" | "paused" | "stopped";
    };
    CompositeTypes: Record<string, never>;
  };
};
