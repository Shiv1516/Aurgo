import Skeleton from "@/components/common/Skeleton";

export default function AuctionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden shrink-0">
        <Skeleton className="absolute inset-0 rounded-none opacity-50" />
        
        <div className="absolute top-4 left-4 z-10">
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>

        <div className="absolute top-4 right-4 z-20">
          <Skeleton variant="circle" className="w-10 h-10" />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
           <Skeleton className="h-4 w-28 rounded-md" />
           <Skeleton className="h-px flex-grow" />
        </div>
        
        <Skeleton className="h-8 w-full mb-2 rounded-lg" />
        <Skeleton className="h-8 w-3/4 mb-6 rounded-lg" />
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
           <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24 rounded-md" />
           </div>
           <div className="text-right space-y-1.5">
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-5 w-28 rounded-md ml-auto" />
           </div>
        </div>
      </div>
    </div>
  );
}
