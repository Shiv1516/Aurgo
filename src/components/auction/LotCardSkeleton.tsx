import Skeleton from "@/components/common/Skeleton";

export default function LotCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        <Skeleton className="absolute inset-0 rounded-none opacity-50" />
        
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Heart */}
        <div className="absolute top-3 right-3">
          <Skeleton variant="circle" className="w-8 h-8" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-5 w-full mb-1.5 rounded-md" />
        <Skeleton className="h-5 w-2/3 mb-4 rounded-md" />
        
        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-4 w-12 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
