export type ActivityKind =
  | "trade"
  | "position"
  | "deposit"
  | "withdrawal"
  | "copy"
  | "follow";

export type ActivityEvent = {
  id: string;
  message: string;
  detail?: string;
  timeAgo: string;
  kind: ActivityKind;
};

export const activityEvents: ActivityEvent[] = [
  {
    id: "jake-trade",
    message: "Jake just made a trade",
    detail: "BTC/USDT · $2,450",
    timeAgo: "Just now",
    kind: "trade",
  },
  {
    id: "sophia-withdrawal",
    message: "Sophia just withdrew",
    detail: "$1,200",
    timeAgo: "18 sec ago",
    kind: "withdrawal",
  },
  {
    id: "marcus-copy",
    message: "Marcus just started copy trading",
    detail: "Following AlphaFlow",
    timeAgo: "31 sec ago",
    kind: "copy",
  },
  {
    id: "daniel-deposit",
    message: "Daniel just deposited",
    detail: "$5,000",
    timeAgo: "1 min ago",
    kind: "deposit",
  },
  {
    id: "chris-position",
    message: "Chris just opened a position",
    detail: "SOL/USDT · $1,850",
    timeAgo: "2 min ago",
    kind: "position",
  },
  {
    id: "emily-copy",
    message: "Emily just copied RiskReducer",
    detail: "$900 allocation",
    timeAgo: "3 min ago",
    kind: "copy",
  },
  {
    id: "alex-trade",
    message: "Alex just made a trade",
    detail: "ETH/USDT · $3,200",
    timeAgo: "4 min ago",
    kind: "trade",
  },
  {
    id: "michael-deposit",
    message: "Michael just deposited",
    detail: "$2,500",
    timeAgo: "5 min ago",
    kind: "deposit",
  },
  {
    id: "sarah-follow",
    message: "Sarah just started following AlphaFlow",
    timeAgo: "6 min ago",
    kind: "follow",
  },
  {
    id: "david-copy",
    message: "David just copied RiskReducer",
    detail: "$1,400 allocation",
    timeAgo: "7 min ago",
    kind: "copy",
  },
  {
    id: "jordan-withdrawal",
    message: "Jordan just withdrew",
    detail: "$750",
    timeAgo: "8 min ago",
    kind: "withdrawal",
  },
  {
    id: "tyler-position",
    message: "Tyler just opened a position",
    detail: "BTC/USDT · $4,100",
    timeAgo: "9 min ago",
    kind: "position",
  },
];
