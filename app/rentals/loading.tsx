import { MainLayout } from "@/components/main-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function RentalsLoading() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="h-6 w-64 mb-4">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl mb-1" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-10 w-36 mt-4 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>

              <div className="mb-6">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Rentals grid skeleton */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-4 w-1/2 mt-1" />
                      <div className="mt-3 flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
