function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800 ${className ?? ""}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Date header */}
      <div className="mb-10">
        <Skeleton className="h-9 w-72" />
      </div>

      {/* Habit list */}
      <div className="mb-10 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>

      {/* Stats */}
      <div className="mb-10 space-y-4">
        <Skeleton className="h-6 w-16" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Week view */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    </div>
  );
}
