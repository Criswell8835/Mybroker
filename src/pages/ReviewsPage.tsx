import { useMemo, useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { cn } from "@/lib/cn";
import { reviewCategories, testimonials } from "@/lib/platform-content";

export function ReviewsPage() {
  const [category, setCategory] = useState<(typeof reviewCategories)[number]>("All");
  const visible = testimonials.filter((item) => category === "All" || item.category === category);
  const average = useMemo(() => {
    const total = testimonials.reduce((sum, item) => sum + item.rating, 0);
    return (total / testimonials.length).toFixed(1);
  }, []);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: testimonials.filter((item) => item.rating === stars).length,
  }));

  return (
    <PublicShell>
      <section className="px-5 pb-28 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] tracking-[0.26em] text-zinc-500">REVIEWS</p>
            <h1 className="mt-5 text-[48px] tracking-[-0.05em] text-white">{average}</h1>
            <p className="mt-2 text-[13px] text-zinc-500">{testimonials.length} notes in this set</p>
            <ul className="mt-6 space-y-2">
              {distribution.map((row) => (
                <li key={row.stars} className="grid grid-cols-[24px_1fr_24px] items-center gap-3 text-[12px] text-zinc-500">
                  <span>{row.stars}</span>
                  <span className="h-px bg-white/10">
                    <span
                      className="block h-px bg-orange"
                      style={{ width: `${(row.count / testimonials.length) * 100}%` }}
                    />
                  </span>
                  <span>{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {reviewCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px]",
                    category === item ? "border-orange/40 text-white" : "border-white/10 text-zinc-400",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4">
              {visible.map((item) => (
                <article key={item.id} className="rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-5">
                  <div className="flex items-center gap-3">
                    <img src={item.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="text-white">{item.name}</p>
                      <p className="text-[12px] text-zinc-500">{item.role} · {item.location}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[12px] text-orange">{"★".repeat(item.rating)}</p>
                  <p className="mt-3 text-[15px] leading-7 text-zinc-300">“{item.quote}”</p>
                  <p className="mt-4 text-[11px] tracking-[0.08em] text-zinc-600">{item.category} · {item.date}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
