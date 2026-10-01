export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] lg:pl-[220px]">
      <div className="fixed inset-y-0 left-0 hidden w-[220px] border-r border-white/[0.06] bg-[#070707] lg:block" />
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="h-4 w-32 rounded bg-white/[0.06]" />
        <div className="mt-2 h-3 w-48 rounded bg-white/[0.04]" />
      </div>
      <div className="grid gap-4 px-6 py-8 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-2xl border border-white/[0.06] bg-[#0c0c0c]" />
        ))}
      </div>
    </div>
  );
}
