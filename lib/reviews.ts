export type CustomerReview = {
  id: string;
  name: string;
  initials: string;
  photo: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  country: string;
  date?: string;
};

export const customerReviews: CustomerReview[] = [
  {
    id: "john-us",
    name: "John",
    initials: "J",
    photo: "/reviews/review-john.jpg",
    rating: 5,
    quote:
      "Really enjoyed using the platform. The interface is clean and the experience feels straightforward.",
    country: "United States",
    date: "March 2026",
  },
  {
    id: "michael-uk",
    name: "Michael",
    initials: "M",
    photo: "/reviews/review-michael.jpg",
    rating: 5,
    quote:
      "The platform is easy to navigate and I like how everything is organized.",
    country: "United Kingdom",
    date: "February 2026",
  },
  {
    id: "daniel-de",
    name: "Daniel",
    initials: "D",
    photo: "/reviews/review-daniel.jpg",
    rating: 5,
    quote:
      "I really like the way the platform presents market information and portfolio activity.",
    country: "Germany",
    date: "January 2026",
  },
  {
    id: "sofia-es",
    name: "Sofia",
    initials: "S",
    photo: "/reviews/review-sofia.jpg",
    rating: 5,
    quote:
      "The layout feels considered. I can move between markets and copy trading without losing my place.",
    country: "Spain",
    date: "December 2025",
  },
  {
    id: "kenji-jp",
    name: "Kenji",
    initials: "K",
    photo: "/reviews/review-kenji.jpg",
    rating: 5,
    quote:
      "Charts and portfolio views are clear. It is easy to understand what I am looking at.",
    country: "Japan",
    date: "November 2025",
  },
  {
    id: "amelia-au",
    name: "Amelia",
    initials: "A",
    photo: "/reviews/review-amelia.jpg",
    rating: 5,
    quote:
      "Signing up was simple, and the product language is calm rather than noisy.",
    country: "Australia",
    date: "October 2025",
  },
  {
    id: "lucas-br",
    name: "Lucas",
    initials: "L",
    photo: "/reviews/review-lucas.jpg",
    rating: 5,
    quote:
      "I appreciate how the platform keeps market context and account activity in one view.",
    country: "Brazil",
    date: "September 2025",
  },
  {
    id: "priya-sg",
    name: "Priya",
    initials: "P",
    photo: "/reviews/review-priya.jpg",
    rating: 5,
    quote:
      "Copy trading is presented as a product I can evaluate, not a stream of noise.",
    country: "Singapore",
    date: "August 2025",
  },
];
