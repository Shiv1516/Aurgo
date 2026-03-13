"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuctionCard from "@/components/auction/AuctionCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { searchAPI } from "@/lib/api";
import { Auction } from "@/types";
import { 
  Search as SearchIcon, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List as ListIcon, 
  X, 
  ChevronDown,
  Shield
} from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Auction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    if (query.length < 2) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Prepared for advanced filtering - appending status if not 'all'
    const params: any = { q: query, limit: 50 };
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sortBy !== 'relevance') params.sort = sortBy;

    searchAPI
      .search(params)
      .then((res) => {
        setResults(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      })
      .finally(() => setIsLoading(false));
  }, [query, statusFilter, sortBy]);

  return (
    <div className="bg-background min-h-screen">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full gold-gradient opacity-5 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="h-px w-8 bg-gold" />
                 <span className="text-gold font-black uppercase tracking-[0.4em] text-sm">Market Discovery</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-none mb-6">
                Search <span className="text-gold italic font-serif normal-case">Results</span>
              </h1>
              <p className="text-gray-400 font-medium text-xl max-w-xl">
                Exploring <span className="text-navy font-bold">{total}</span> authenticated acquisitions matching <span className="text-burgundy italic">&ldquo;{query}&rdquo;</span>
              </p>
            </div>
            
            {/* Quick Sort / View Toggle */}
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
               <div className="flex bg-white rounded-xl shadow-sm p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
               </div>
               <div className="h-8 w-px bg-gray-200 mx-2" />
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="bg-transparent text-sm font-black text-navy uppercase tracking-widest outline-none cursor-pointer pr-4"
               >
                  <option value="relevance">Sort By: Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="endingSoon">Ending Soonest</option>
                  <option value="priceLow">Price: Low to High</option>
               </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Refinement Sidebar */}
          <aside className="lg:w-72 shrink-0">
             <div className="sticky top-24 space-y-10">
                <div>
                   <h3 className="text-sm font-black text-navy uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                      Refine Results <SlidersHorizontal className="h-3 w-3 text-gold" />
                   </h3>
                   
                   <div className="space-y-6">
                      {/* Status Filter */}
                      <div>
                         <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Auction Status</p>
                         <div className="space-y-2">
                            {['all', 'live', 'scheduled', 'ended'].map((status) => (
                               <button
                                 key={status}
                                 onClick={() => setStatusFilter(status)}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${statusFilter === status ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                               >
                                  <span className="capitalize">{status === 'all' ? 'All Opportunities' : status === 'live' ? 'Live Sales' : status === 'scheduled' ? 'Coming Soon' : 'Closed'}</span>
                                  {statusFilter === status && <div className="h-1.5 w-1.5 bg-gold rounded-full" />}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Trust Guarantee Box */}
                      <div className="bg-navy p-6 rounded-[2rem] text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gold/10 rounded-full -translate-y-10 translate-x-10" />
                         <Shield className="h-6 w-6 text-gold mb-4" />
                         <p className="text-sm font-black uppercase tracking-widest mb-2">The Augeo Shield</p>
                         <p className="text-sm text-white/60 leading-relaxed italic">Every lot in our search results is certified by our internal department of heritage experts.</p>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Main Results Area */}
          <main className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl animate-shimmer bg-[linear-gradient(110deg,#f3f4f6,45%,#e5e7eb,55%,#f3f4f6)] bg-[length:200%_100%]" />
                 ))}
              </div>
            ) : results.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-6"}>
                {results.map((r: any) => (
                  <AuctionCard key={r._id} auction={r} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                   <SearchIcon className="h-10 w-10 text-gray-200" />
                </div>
                <h2 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">No results for <span className="text-burgundy italic">&ldquo;{query}&rdquo;</span></h2>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto italic">Our curators are constantly sourcing world-class masterpieces. Try adjusting your refinement or search term.</p>
                <div className="flex justify-center gap-4">
                   <button 
                     onClick={() => setStatusFilter('all')}
                     className="btn-outline-secondary !rounded-full !px-8 !py-3"
                   >
                     Reset Refinements
                   </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
