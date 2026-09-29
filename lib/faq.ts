export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "open-account",
    question: "How do I open an account with [PLATFORM NAME]?",
    answer:
      "Click “Open Account”, register with your email, complete KYC verification, and fund your account. The process typically takes 24–48 hours.",
  },
  {
    id: "funds-safety",
    question: "Are my funds safe and segregated?",
    answer:
      "Yes. Client funds are held in segregated accounts, completely separate from our operating reserves, with strict custody procedures.",
  },
  {
    id: "minimum-investment",
    question: "What is the minimum investment?",
    answer:
      "Minimum requirements vary by service. Contact our client desk after registration for current thresholds and eligibility.",
  },
  {
    id: "withdrawals",
    question: "How long do withdrawals take?",
    answer:
      "Withdrawal requests are processed within 1–3 business days after approval. Crypto withdrawals are typically faster.",
  },
  {
    id: "copy-trading",
    question: "Do you offer copy trading?",
    answer:
      "Yes. Registered clients can mirror verified professional traders with transparent performance history.",
  },
  {
    id: "ai-trading",
    question: "How does AI Trading work?",
    answer:
      "AI Trading allows eligible users to authorize the platform’s AI system to trade supported cryptocurrencies according to their selected parameters and risk preferences. Users can choose which supported assets they want the AI to trade.",
  },
  {
    id: "modify-ai",
    question: "Can I stop or modify AI Trading?",
    answer:
      "Yes. Users can review their active AI trading strategies and, where supported, pause or stop them and adjust their configuration.",
  },
  {
    id: "returns",
    question: "Are returns guaranteed?",
    answer:
      "No. Cryptocurrency markets are volatile, and neither AI Trading nor Copy Trading guarantees profits. Past performance does not guarantee future results.",
  },
];
