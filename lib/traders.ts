export const SAMPLE_PROFILE_LABEL = "SAMPLE PROFILE";

export type TraderProfile = {
  id: string;
  name: string;
  strategy: string;
  performance: number;
  risk: "Low" | "Moderate" | "High";
  followers: number;
  allocation: string;
  style: string;
  note: string;
};

export const sampleTraders: TraderProfile[] = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    strategy: "Crypto Strategy",
    performance: 18.4,
    risk: "Moderate",
    followers: 2481,
    allocation: "BTC, ETH, majors",
    style: "Structured trend participation with defined invalidation.",
    note: "Sample profile for interface demonstration only.",
  },
  {
    id: "jordan-blake",
    name: "Jordan Blake",
    strategy: "Momentum Strategy",
    performance: 12.7,
    risk: "Low",
    followers: 1842,
    allocation: "Large-cap momentum",
    style: "Selective continuation setups with conservative sizing.",
    note: "Sample profile for interface demonstration only.",
  },
];

export const copyTradingSteps = [
  {
    number: "01",
    title: "Choose a trader",
    description: "Browse sample strategies and risk profiles before you follow anyone.",
  },
  {
    number: "02",
    title: "Review their strategy",
    description: "Read the approach, market focus, and how risk is expressed.",
  },
  {
    number: "03",
    title: "Set your allocation",
    description: "Decide how much capital you want a selected strategy to represent.",
  },
  {
    number: "04",
    title: "Follow their trades",
    description: "Monitor copied activity from one platform view as the product evolves.",
  },
];
