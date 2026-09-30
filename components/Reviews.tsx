import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { customerReviews, type CustomerReview } from "@/lib/reviews";

function Stars({ rating }: { rating: CustomerReview["rating"] }) {
  return (
    <p className="flex gap-0.5 text-[11px] tracking-[0.12em] text-orange" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < rating ? "text-orange" : "text-zinc-700"}>
          ★
        </span>
      ))}
    </p>
  );
}

function ReviewCard({
  review,
  onOpen,
}: {
  review: CustomerReview;
  onOpen: (review: CustomerReview) => void;
}) {
  return (
    <article className="flex h-full min-w-[78%] snap-start flex-col rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] transition-colors duration-150 hover:border-white/[0.14] sm:min-w-0">
      <button
        type="button"
        onClick={() => onOpen(review)}
        aria-label={`Read ${review.name}'s review`}
        className="flex h-full w-full cursor-pointer flex-col px-5 py-5 text-left sm:px-6 sm:py-6"
      >
        <div className="flex items-center gap-3">
          <img
            src={review.photo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full border border-white/[0.08] object-cover"
          />
          <p className="text-[14px] tracking-[-0.01em] text-white">{review.name}</p>
        </div>
        <div className="mt-3">
          <Stars rating={review.rating} />
        </div>
        <p className="mt-4 flex-1 text-[14px] leading-6 text-zinc-300">
          “{review.quote}”
        </p>
        <p className="mt-5 text-[12px] text-zinc-500">{review.country}</p>
        {review.date ? (
          <p className="mt-1 text-[11px] tracking-[0.08em] text-zinc-600">{review.date}</p>
        ) : null}
        <span className="mt-4 text-[12px] text-orange">Read more</span>
      </button>
    </article>
  );
}

function ReviewDialog({
  review,
  onClose,
}: {
  review: CustomerReview;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="review-dialog-layer fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="review-dialog-panel relative z-10 max-h-[min(32rem,calc(100dvh-1.5rem))] w-full max-w-[440px] overflow-y-auto rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-5 py-5 sm:px-6 sm:py-6"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition-colors duration-150 hover:text-white"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 pr-10">
          <img
            src={review.photo}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full border border-white/[0.08] object-cover"
          />
          <div>
            <h3 id={titleId} className="text-[16px] tracking-[-0.01em] text-white">
              {review.name}
            </h3>
            <p className="mt-1 text-[12px] text-zinc-500">{review.country}</p>
          </div>
        </div>
        <div className="mt-4">
          <Stars rating={review.rating} />
        </div>
        <p className="mt-4 text-[16px] leading-7 text-zinc-200">“{review.quote}”</p>
        {review.date ? (
          <p className="mt-5 text-[11px] tracking-[0.08em] text-zinc-600">{review.date}</p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function Reviews() {
  const [active, setActive] = useState<CustomerReview | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const closeReview = useCallback(() => {
    setActive(null);
    returnFocus.current?.focus();
  }, []);

  const openReview = (review: CustomerReview) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActive(review);
  };

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">
            CUSTOMER REVIEWS
          </p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            What traders notice first.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-zinc-400">
            Direct accounts of using the platform — the interface, the structure,
            and how market information is presented.
          </p>
        </Reveal>

        <div className="reviews-rail mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {customerReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onOpen={openReview} />
          ))}
        </div>
      </div>
      {active ? <ReviewDialog review={active} onClose={closeReview} /> : null}
    </section>
  );
}
