export const SAMPLE_PROFILE_LABEL = "SAMPLE PROFILE";

export type TraderProfile = {
  id: string;
  name: string;
  strategy: string;
  performance: number;
  risk: "Low" | "Moderate" | "High";
  followers: number;
  consistency: string;
  allocation: string;
  style: string;
  note: string;
};

export const sampleTraders: TraderProfile[] = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    strategy: "Momentum Strategy",
    performance: 18.4,
    risk: "Moderate",
    followers: 2481,
    consistency: "High",
    allocation: "BTC, ETH, majors",
    style: "Structured trend participation with defined invalidation.",
    note: "Sample profile for interface demonstration only.",
  },
  {
    id: "jordan-blake",
    name: "Jordan Blake",
    strategy: "Market Strategy",
    performance: 12.7,
    risk: "Low",
    followers: 1842,
    consistency: "Steady",
    allocation: "Large-cap momentum",
    style: "Selective continuation setups with conservative sizing.",
    note: "Sample profile for interface demonstration only.",
  },
];

export const copyTradingSteps = [
  {
    number: "01",
    title: "Discover",
    description: "Browse sample strategies and risk profiles before you follow anyone.",
  },
  {
    number: "02",
    title: "Review",
    description: "Read the approach, market focus, and how risk is expressed.",
  },
  {
    number: "03",
    title: "Follow",
    description: "Follow a sample profile from one platform view. Past figures are demonstration only.",
  },
];
