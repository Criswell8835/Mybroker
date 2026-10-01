export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "open-account",
    question: "How do I open an account?",
    answer:
      "Creating an account is simple. Register with your details, complete the required verification process, and once your account is approved, you can access the platform and its trading features.",
  },
  {
    id: "funds",
    question: "Are my funds safe and segregated?",
    answer:
      "We take account security and fund protection seriously. Your account and transaction activity are protected through security measures designed to keep your information and assets secure.",
  },
  {
    id: "minimum",
    question: "What is the minimum amount I need to start trading?",
    answer:
      "The minimum amount depends on the trading feature or strategy you choose. Different services may have different minimum requirements.",
  },
  {
    id: "withdrawals",
    question: "How do withdrawals work?",
    answer:
      "You can request a withdrawal from your account by selecting the supported asset, entering the amount and destination wallet, and submitting the request. Withdrawals are subject to the applicable verification and review process.",
  },
  {
    id: "copy",
    question: "How does Copy Trading work?",
    answer:
      "Copy Trading allows you to follow selected traders or strategies and automatically mirror their trades in your account based on the copy settings you choose. You can review available strategies, performance information, and associated risks before deciding whether to copy.",
  },
  {
    id: "ai",
    question: "How does AI Trading work?",
    answer:
      "AI Trading allows you to configure an AI trading strategy based on your selected asset, allocation, and risk preferences. Once activated, the system can analyze market conditions and execute trades according to the configured strategy.",
  },
  {
    id: "pause-ai",
    question: "Can I pause or stop AI Trading?",
    answer:
      "Yes. You can pause AI Trading or stop an active AI strategy from your account controls. This gives you control over when the strategy is active.",
  },
  {
    id: "returns",
    question: "Are trading returns guaranteed?",
    answer:
      "No. Trading involves risk, and neither AI Trading nor Copy Trading guarantees profits. Past performance does not guarantee future results.",
  },
  {
    id: "stop-copy",
    question: "Can I stop Copy Trading?",
    answer:
      "Yes. You can pause or stop an active copy-trading relationship through your account controls.",
  },
  {
    id: "verification",
    question: "Do I need to complete verification before using the platform?",
    answer:
      "Certain platform features may require identity verification before they can be accessed. Verification requirements depend on the services available on your account.",
  },
];
