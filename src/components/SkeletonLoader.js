'use client';

export function ItemCardSkeleton({ count = 6 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="card animate-pulse">
          {/* Image Skeleton */}
          <div className="h-48 bg-neutral-200 relative">
            <div className="absolute top-3 left-3 w-20 h-6 bg-neutral-300 rounded-full"></div>
            <div className="absolute top-3 right-3 w-16 h-6 bg-neutral-300 rounded-full"></div>
          </div>

          {/* Content Skeleton */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <div className="h-5 bg-neutral-200 rounded w-3/4"></div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-neutral-200 rounded"></div>
              <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
            </div>

            {/* Category */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-neutral-200 rounded"></div>
              <div className="h-3 bg-neutral-200 rounded w-24"></div>
            </div>

            {/* Location & Time */}
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-neutral-200 rounded w-20"></div>
              <div className="h-3 bg-neutral-200 rounded w-20"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-neutral-200 rounded-full"></div>
                <div className="h-3 bg-neutral-200 rounded w-16"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 bg-neutral-200 rounded w-8"></div>
                <div className="h-3 bg-neutral-200 rounded w-8"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function StatCardSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="card p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-neutral-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-neutral-200 rounded w-24"></div>
        </div>
      ))}
    </>
  );
}

export function ItemDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button Skeleton */}
      <div className="h-10 w-32 bg-neutral-200 rounded-lg mb-6 animate-pulse"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="card p-4 animate-pulse">
          <div className="h-96 bg-neutral-200 rounded-xl"></div>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <div className="card p-6 animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-20 h-6 bg-neutral-200 rounded-full"></div>
              <div className="w-20 h-6 bg-neutral-200 rounded-full"></div>
            </div>
          </div>

          <div className="card p-6 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  <div className="h-4 bg-neutral-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8 mb-8 animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-neutral-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-64"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-10 bg-neutral-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-24"></div>
          </div>
        ))}
      </div>

      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex-1">
                <div className="h-5 bg-neutral-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-32"></div>
              </div>
              <div className="w-16 h-8 bg-neutral-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemCardSkeleton;
