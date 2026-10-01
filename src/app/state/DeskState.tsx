import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { alertSeed, aiStrategySeed, markets, subscriptionPreview, type AiRisk, type AiStatus, type AiStrategyRecord } from "@/src/data/dashboardMock";
import type { PricingPlan } from "@/lib/pricing";

export type DeskAlert = {
  id: string;
  kind: string;
  asset: string;
  trigger: string;
  status: "Armed" | "Paused";
};

export type CopyLink = {
  traderId: string;
  amount: number;
  risk: string;
  stop: string;
};

export type AiDraft = {
  name: string;
  style: string;
  asset: string;
  allocated: number;
  risk: AiRisk;
  maxPositionPct: number;
  stopLoss: string;
  maxDailyLoss: number;
  maxPositions: number;
  volatile: boolean;
};

type DeskStateValue = {
  watchlist: string[];
  toggleWatch: (id: string) => void;
  alerts: DeskAlert[];
  saveAlert: (alert: DeskAlert) => void;
  removeAlert: (id: string) => void;
  aiPaused: boolean;
  setAiPaused: (paused: boolean) => void;
  notices: boolean;
  setNotices: (value: boolean) => void;
  confirmTicket: boolean;
  setConfirmTicket: (value: boolean) => void;
  strategies: AiStrategyRecord[];
  setStrategyStatus: (id: string, status: AiStatus) => void;
  updateStrategyRisk: (id: string, patch: Partial<Pick<AiStrategyRecord, "risk" | "maxPositionPct" | "maxDailyLoss" | "maxPositions" | "volatile">>) => void;
  activateStrategy: (draft: AiDraft) => string;
  closedPositions: string[];
  closePosition: (id: string, strategyId: string) => void;
  localEvents: { id: string; strategyId: string; time: string; text: string }[];
  copies: CopyLink[];
  saveCopy: (link: CopyLink) => void;
  planId: PricingPlan["id"];
  setPlanId: (id: PricingPlan["id"]) => void;
};

const DeskStateContext = createContext<DeskStateValue | null>(null);

export function DeskStateProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState(() => markets.map((item) => item.id));
  const [alerts, setAlerts] = useState<DeskAlert[]>(alertSeed);
  const [aiPaused, setAiPaused] = useState(false);
  const [notices, setNotices] = useState(true);
  const [confirmTicket, setConfirmTicket] = useState(true);
  const [strategies, setStrategies] = useState<AiStrategyRecord[]>(aiStrategySeed);
  const [closedPositions, setClosedPositions] = useState<string[]>([]);
  const [localEvents, setLocalEvents] = useState<DeskStateValue["localEvents"]>([]);
  const [copies, setCopies] = useState<CopyLink[]>([]);
  const [planId, setPlanId] = useState<PricingPlan["id"]>(subscriptionPreview.planId);

  const value = useMemo<DeskStateValue>(
    () => ({
      watchlist,
      toggleWatch(id) {
        setWatchlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
      },
      alerts,
      saveAlert(alert) {
        setAlerts((current) => {
          const index = current.findIndex((item) => item.id === alert.id);
          if (index === -1) return [alert, ...current];
          const next = [...current];
          next[index] = alert;
          return next;
        });
      },
      removeAlert(id) {
        setAlerts((current) => current.filter((item) => item.id !== id));
      },
      aiPaused,
      setAiPaused,
      notices,
      setNotices,
      confirmTicket,
      setConfirmTicket,
      strategies,
      setStrategyStatus(id, status) {
        setStrategies((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
      },
      updateStrategyRisk(id, patch) {
        setStrategies((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      },
      activateStrategy(draft) {
        const id = `session-${Date.now()}`;
        setStrategies((current) => [
          {
            id,
            name: draft.name,
            style: draft.style,
            asset: draft.asset,
            allocated: draft.allocated,
            available: draft.allocated,
            todayPnl: 0,
            totalPnl: 0,
            risk: draft.risk,
            status: "ACTIVE",
            winRate: 0,
            maxPositionPct: draft.maxPositionPct,
            stopLoss: draft.stopLoss,
            maxDailyLoss: draft.maxDailyLoss,
            maxPositions: draft.maxPositions,
            volatile: draft.volatile,
          },
          ...current,
        ]);
        setLocalEvents((current) => [
          { id: `ev-${id}`, strategyId: id, time: "Now", text: "Strategy armed in this session. No order was sent." },
          ...current,
        ]);
        return id;
      },
      closedPositions,
      closePosition(id, strategyId) {
        setClosedPositions((current) => (current.includes(id) ? current : [...current, id]));
        setLocalEvents((current) => [
          { id: `close-${id}`, strategyId, time: "Now", text: "Position marked closed in this session. No order was sent." },
          ...current,
        ]);
      },
      localEvents,
      copies,
      saveCopy(link) {
        setCopies((current) => {
          const index = current.findIndex((item) => item.traderId === link.traderId);
          if (index === -1) return [link, ...current];
          const next = [...current];
          next[index] = link;
          return next;
        });
      },
      planId,
      setPlanId,
    }),
    [alerts, aiPaused, closedPositions, confirmTicket, copies, localEvents, notices, planId, strategies, watchlist],
  );

  return <DeskStateContext.Provider value={value}>{children}</DeskStateContext.Provider>;
}

export function useDeskState() {
  const value = useContext(DeskStateContext);
  if (!value) throw new Error("Desk state is missing.");
  return value;
}
