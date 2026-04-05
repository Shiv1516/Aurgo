import Skeleton from "./Skeleton";
export { Skeleton };
import { cn } from "@/lib/utils";

/**
 * StatsSkeleton: A 4-column grid of outlined cards for dashboard summaries.
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <Skeleton className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ListSkeleton: Mimicking the activity logs, bid rows, or notifications.
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <div className="w-20 space-y-2">
            <Skeleton className="h-4 w-full ml-auto" />
            <Skeleton className="h-3 w-2/3 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * CategorySliderSkeleton: Preserving the horizontal scroll layout for categories.
 */
export function CategorySliderSkeleton() {
  return (
    <div className="flex gap-8 pb-4 overflow-x-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-6 p-10 bg-white border border-gray-200 rounded-[12px] w-[220px] shrink-0 shadow-sm animate-pulse">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
             <div className="w-12 h-12 rounded-lg bg-gray-100" />
          </div>
          <div className="space-y-2 w-full flex flex-col items-center text-center">
            <div className="h-3 w-16 bg-burgundy/10 rounded" />
            <div className="h-5 w-24 bg-navy/5 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * HeroSkeleton: Placeholder for the homepage hero section.
 */
export function HeroSkeleton() {
  return (
    <div className="relative h-[65vh] min-h-[450px] flex items-center justify-center bg-navy/10 overflow-hidden">
       <div className="max-w-5xl w-full mx-auto px-4 text-center space-y-10">
          <div className="space-y-4 flex flex-col items-center">
             <Skeleton className="h-14 w-3/4 md:w-1/2 rounded-xl" />
             <Skeleton className="h-14 w-1/2 md:w-1/3 rounded-xl" />
          </div>
          <div className="max-w-4xl mx-auto w-full h-16 bg-white/20 rounded-xl overflow-hidden p-2 flex gap-4">
             <Skeleton className="flex-grow h-full rounded-lg" />
             <Skeleton className="w-32 h-full rounded-lg" />
          </div>
       </div>
    </div>
  );
}

/**
 * GenericGridSkeleton: A grid of cards (e.g. for auctions).
 */
export function GenericGridSkeleton({ count = 6, cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }: { count?: number, cols?: string }) {
  return (
    <div className={cn("grid gap-6", cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card min-h-[450px] flex flex-col p-0 overflow-hidden border border-gray-100 shadow-sm">
          {/* Image Area placeholder */}
          <div className="relative aspect-[4/3] w-full bg-navy overflow-hidden shrink-0 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-burgundy/20 opacity-50" />
             <div className="w-12 h-12 rounded-full border-2 border-white/5 animate-pulse" />
          </div>

          {/* Content Area placeholder */}
          <div className="p-6 flex flex-col flex-grow bg-white space-y-6">
            <div className="flex items-center gap-2">
               <Skeleton className="h-3 w-20 rounded" />
               <div className="h-px flex-grow bg-gray-50" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-7 w-full rounded-lg" />
              <Skeleton className="h-7 w-2/3 rounded-lg" />
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2 flex flex-col items-end">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * DetailSkeleton: Placeholder for auction/lot detail pages.
 */
export function DetailSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex gap-3">
                 <Skeleton className="h-6 w-20 rounded" />
                 <Skeleton className="h-6 w-24 rounded" />
              </div>
              <Skeleton className="h-14 w-full md:w-3/4 rounded-xl" />
              <div className="space-y-4">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-6 mt-8">
                 <Skeleton className="h-5 w-32" />
                 <Skeleton className="h-5 w-40" />
                 <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="lg:w-80 space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <div className="flex flex-col gap-3">
                 <Skeleton className="h-14 w-full rounded-xl" />
                 <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
                     <Skeleton className="aspect-square w-full rounded-xl" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                     </div>
                  </div>
               ))}
            </div>
            <div className="space-y-8">
               <Skeleton className="h-96 w-full rounded-xl" />
            </div>
         </div>
      </div>
    </div>
  );
}

/**
 * TableSkeleton: Placeholder for administrative and user data tables.
 */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number, cols?: number }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-grow rounded" />
        ))}
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-5 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className={cn("h-4 flex-grow rounded", j === 0 && "w-32", j > 0 && "w-20")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * CategoryGridSkeleton: Matches the 4-column category discovery grid.
 */
export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card h-80 relative flex flex-col p-0 overflow-hidden group">
          {/* Background Layer placeholder */}
          <div className="absolute inset-0 z-0 bg-navy">
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-burgundy/10 opacity-40 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10" />
          </div>

          <div className="relative z-20 flex flex-col h-full items-center justify-center text-center p-8 space-y-6">
            {/* Glassmorphic Icon Container placeholder */}
            <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center animate-pulse shadow-xl">
               <div className="w-8 h-8 rounded-lg bg-white/5" />
            </div>

            <div className="space-y-3 w-full flex flex-col items-center">
              <Skeleton className="h-4 w-24 bg-white/10 rounded mb-1" />
              <div className="h-8 w-40 bg-white/10 rounded-lg animate-pulse" />
              <Skeleton className="h-3 w-32 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
