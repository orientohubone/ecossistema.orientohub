interface DashboardPageSkeletonProps {
  hero?: boolean;
  cards?: number;
  columns?: 1 | 2;
}

const DashboardPageSkeleton = ({
  hero = false,
  cards = 4,
  columns = 2,
}: DashboardPageSkeletonProps) => {
  const cardItems = Array.from({ length: cards });
  const listItems = Array.from({ length: 4 });

  return (
    <div className="route-skeleton-shell min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom py-8 space-y-8">
        <section className="space-y-4">
          {hero ? (
            <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="route-skeleton-block h-20 w-20 rounded-full" />
                  <div className="space-y-3">
                    <div className="route-skeleton-block h-8 w-72 max-w-full rounded-2xl" />
                    <div className="route-skeleton-block h-4 w-64 max-w-full rounded-full" />
                    <div className="route-skeleton-block h-3 w-56 max-w-full rounded-full" />
                  </div>
                </div>
                <div className="route-skeleton-block h-28 w-40 rounded-3xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="route-skeleton-block h-10 w-72 max-w-full rounded-2xl" />
              <div className="route-skeleton-block h-4 w-80 max-w-full rounded-full" />
            </div>
          )}
        </section>

        <section className={`grid gap-6 ${cards <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
          {cardItems.map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="route-skeleton-block h-4 w-24 rounded-full" />
                  <div className="route-skeleton-block h-8 w-20 rounded-xl" />
                </div>
                <div className="route-skeleton-block h-12 w-12 rounded-2xl" />
              </div>
              <div className="route-skeleton-block h-3 w-28 rounded-full" />
            </div>
          ))}
        </section>

        <section className={`grid gap-8 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[1.45fr_1fr]'}`}>
          <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="route-skeleton-block h-6 w-44 rounded-full" />
                <div className="route-skeleton-block h-3 w-60 max-w-full rounded-full" />
              </div>
              <div className="route-skeleton-block h-10 w-24 rounded-full" />
            </div>

            <div className="space-y-4">
              {listItems.map((_, index) => (
                <div key={index} className="flex items-start gap-4 rounded-2xl bg-gray-50/70 p-4 dark:bg-gray-900/30">
                  <div className="route-skeleton-block h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="route-skeleton-block h-4 w-10/12 rounded-full" />
                    <div className="route-skeleton-block h-3 w-7/12 rounded-full" />
                    <div className="route-skeleton-block h-3 w-5/12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {columns > 1 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
                <div className="space-y-3">
                  <div className="route-skeleton-block h-6 w-36 rounded-full" />
                  <div className="route-skeleton-block h-36 w-full rounded-3xl" />
                  <div className="route-skeleton-block h-4 w-4/5 rounded-full" />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
                <div className="space-y-4">
                  <div className="route-skeleton-block h-6 w-40 rounded-full" />
                  <div className="route-skeleton-block h-20 w-full rounded-2xl" />
                  <div className="route-skeleton-block h-20 w-full rounded-2xl" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPageSkeleton;
