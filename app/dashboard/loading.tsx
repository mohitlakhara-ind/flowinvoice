export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-[var(--surface-2)] rounded-lg mb-2" />
          <div className="h-4 w-64 bg-[var(--surface-2)] rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-[var(--surface-2)] rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-24 bg-[var(--surface-2)] rounded" />
              <div className="w-8 h-8 rounded-xl bg-[var(--surface-2)]" />
            </div>
            <div className="h-8 w-32 bg-[var(--surface-2)] rounded-lg mb-2" />
            <div className="h-3 w-16 bg-[var(--surface-2)] rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 border border-[var(--border)] min-h-[400px]">
            <div className="h-6 w-40 bg-[var(--surface-2)] rounded-lg mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface-2)]" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-[var(--surface-2)] rounded" />
                      <div className="h-3 w-24 bg-[var(--surface-2)] rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-[var(--surface-2)] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar/Secondary Area Skeleton */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-[var(--border)] min-h-[400px]">
            <div className="h-6 w-32 bg-[var(--surface-2)] rounded-lg mb-6" />
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--surface-2)] mt-2" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full bg-[var(--surface-2)] rounded" />
                    <div className="h-3 w-3/4 bg-[var(--surface-2)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
