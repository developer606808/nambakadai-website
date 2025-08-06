import MainLayout from "@/components/main-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function RentalDetailsLoading() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-6 w-64 mb-4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-3/4 mb-2" />

            <div className="flex flex-wrap items-center mb-4">
              <Skeleton className="h-5 w-32 mr-4" />
              <Skeleton className="h-5 w-32 mr-4" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Image gallery skeleton */}
            <div className="mb-8">
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
                <Skeleton className="col-span-2 row-span-2 rounded-lg" />
                <Skeleton className="rounded-lg" />
                <Skeleton className="rounded-lg" />
                <Skeleton className="rounded-lg" />
                <Skeleton className="rounded-lg" />
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="mb-8">
              <div className="flex space-x-4 border-b mb-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />

              <Skeleton className="h-6 w-40 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
              </div>
            </div>

            {/* Similar rentals skeleton */}
            <div className="mt-12">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <div className="p-3">
                        <Skeleton className="h-5 w-full mb-2" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              <Skeleton className="h-1 w-full my-3" />

              <div className="mb-4">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-10 w-full mb-3" />

                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-10 w-full mb-3" />

                <Skeleton className="h-24 w-full mb-4" />
              </div>

              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-10 w-full mb-3" />

              <Skeleton className="h-1 w-full my-5" />

              <div className="flex items-center mb-3">
                <Skeleton className="h-12 w-12 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
