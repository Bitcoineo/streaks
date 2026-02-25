function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className ?? ""}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Date header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Habit list */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Stats */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-6 w-16" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Week view */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}
