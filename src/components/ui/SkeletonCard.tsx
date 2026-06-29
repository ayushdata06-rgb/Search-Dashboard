export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)]" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--bg-elevated)] rounded w-32 mb-2" />
          <div className="h-3 bg-[var(--bg-elevated)] rounded w-24" />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-3 bg-[var(--bg-elevated)] rounded w-20" />
        <div className="h-3 bg-[var(--bg-elevated)] rounded w-16" />
      </div>
      <div className="h-9 bg-[var(--bg-elevated)] rounded-lg w-full" />
    </div>
  );
}
