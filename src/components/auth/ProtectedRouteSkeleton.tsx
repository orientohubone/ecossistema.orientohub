const sidebarItems = Array.from({ length: 7 });
const statCards = Array.from({ length: 4 });
const listRows = Array.from({ length: 5 });

const ProtectedRouteSkeleton = () => {
  return (
    <div className="route-skeleton-shell min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-gray-200/70 bg-white/90 px-4 py-4 dark:border-gray-700/80 dark:bg-gray-800/90 lg:flex lg:flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="route-skeleton-block h-10 w-10 rounded-2xl" />
            <div className="space-y-2">
              <div className="route-skeleton-block h-4 w-28 rounded-full" />
              <div className="route-skeleton-block h-3 w-20 rounded-full" />
            </div>
          </div>

          <div className="mb-5 space-y-2">
            <div className="route-skeleton-block h-11 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            {sidebarItems.map((_, index) => (
              <div
                key={index}
                className="route-skeleton-block h-11 w-full rounded-xl"
              />
            ))}
          </div>

          <div className="mt-auto space-y-3 pt-6">
            <div className="route-skeleton-block h-24 w-full rounded-2xl" />
            <div className="route-skeleton-block h-11 w-full rounded-xl" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-gray-200/70 bg-white/85 px-4 py-4 backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/85 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="route-skeleton-block h-10 w-10 rounded-xl lg:hidden" />
                <div className="route-skeleton-block hidden h-11 w-72 rounded-xl md:block" />
              </div>
              <div className="flex items-center gap-3">
                <div className="route-skeleton-block hidden h-9 w-28 rounded-full sm:block" />
                <div className="route-skeleton-block h-10 w-10 rounded-full" />
                <div className="hidden space-y-2 sm:block">
                  <div className="route-skeleton-block h-3 w-24 rounded-full" />
                  <div className="route-skeleton-block h-3 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <section className="space-y-3">
                <div className="route-skeleton-block h-9 w-64 rounded-2xl" />
                <div className="route-skeleton-block h-4 w-80 max-w-full rounded-full" />
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="route-skeleton-block h-3 w-24 rounded-full" />
                        <div className="route-skeleton-block h-7 w-20 rounded-xl" />
                      </div>
                      <div className="route-skeleton-block h-11 w-11 rounded-2xl" />
                    </div>
                    <div className="route-skeleton-block h-3 w-32 rounded-full" />
                  </div>
                ))}
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="route-skeleton-block h-5 w-48 rounded-full" />
                      <div className="route-skeleton-block h-3 w-64 max-w-full rounded-full" />
                    </div>
                    <div className="route-skeleton-block h-9 w-24 rounded-full" />
                  </div>

                  <div className="space-y-4">
                    {listRows.map((_, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="route-skeleton-block h-11 w-11 rounded-2xl" />
                        <div className="flex-1 space-y-2">
                          <div className="route-skeleton-block h-4 w-11/12 rounded-full" />
                          <div className="route-skeleton-block h-3 w-7/12 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
                    <div className="space-y-3">
                      <div className="route-skeleton-block h-5 w-36 rounded-full" />
                      <div className="route-skeleton-block h-28 w-full rounded-3xl" />
                      <div className="route-skeleton-block h-4 w-4/5 rounded-full" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-800/70">
                    <div className="space-y-4">
                      <div className="route-skeleton-block h-5 w-32 rounded-full" />
                      <div className="route-skeleton-block h-16 w-full rounded-2xl" />
                      <div className="route-skeleton-block h-16 w-full rounded-2xl" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRouteSkeleton;
