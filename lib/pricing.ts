export type PricingPlan = {
  id: "starter" | "pro" | "advanced";
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "month",
    description: "Explore markets and copy trading with the core KAIVO workspace.",
    features: [
      "Market overview and watchlists",
      "Copy trading discovery",
      "AI market summaries",
      "Labeled demonstration data",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "month",
    description: "Full AI trading interface with deeper strategy context.",
    features: [
      "Everything in Starter",
      "AI trading desk and indicators",
      "Strategy condition views",
      "Copy trading allocation tools",
      "Advanced market table",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 129,
    period: "month",
    description: "A broader workspace for traders who want more analytical depth.",
    features: [
      "Everything in Pro",
      "Multiple strategy workspaces",
      "Expanded analytics layout",
      "Priority onboarding",
    ],
    cta: "Choose Advanced",
    highlighted: false,
  },
];
