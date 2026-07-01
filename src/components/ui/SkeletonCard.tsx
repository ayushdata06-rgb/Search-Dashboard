export function SkeletonCard() {
  return (
    <div className="p-5 animate-pulse bg-white/5 rounded-2xl h-48 border border-white/5 flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-32 mb-2" />
          <div className="h-3 bg-white/10 rounded w-24" />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-3 bg-white/10 rounded w-20" />
        <div className="h-3 bg-white/10 rounded w-16" />
      </div>
      <div className="h-9 bg-white/10 rounded-lg w-full" />
    </div>
  );
}
