'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import AuctionCard from '@/components/auction/AuctionCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { auctionAPI } from '@/lib/api';
import { Auction } from '@/types';
import { SlidersHorizontal, Grid, List as ListIcon, Shield, ChevronRight, Package, LayoutGrid } from 'lucide-react';
import { GenericGridSkeleton, Skeleton } from '@/components/common/Skeletons';

export default function CategoryAuctionsPage() {
  const params = useParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setIsLoading(true);
    const filterParams: any = {};
    if (statusFilter !== 'all') filterParams.status = statusFilter;

    auctionAPI.getByCategory(params.slug as string, filterParams)
      .then(res => { 
        setAuctions(res.data.data || []); 
        setCategoryName(res.data.category?.name || ''); 
        setCategorySlug(res.data.category?.slug || '');
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [params.slug, statusFilter]);

  if (isLoading && auctions.length === 0) return (
    <div className="bg-background min-h-screen">
      <div className="bg-white border-b border-gray-200 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full gold-gradient opacity-5 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 flex-grow">
              <div className="flex items-center gap-3">
                 <div className="h-px w-8 bg-gold/30" />
                 <Skeleton className="h-4 w-32 bg-gold/20 rounded" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4 md:w-1/2 rounded-2xl" />
                <Skeleton className="h-6 w-full md:w-2/3 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200">
               <div className="w-24 h-10 bg-white rounded-xl shadow-sm animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <GenericGridSkeleton count={6} />
      </div>
    </div>
  );
  
  return (
    <div className="bg-background min-h-screen">
      {/* Premium Category Header */}
      <div className="bg-white border-b border-gray-200 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full gold-gradient opacity-5 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="h-px w-8 bg-gold" />
                 <span className="text-gold font-black uppercase tracking-[0.1em] text-sm">Department Portfolio</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-none mb-6">
                {categoryName || 'Department'} <span className="text-gold italic font-serif normal-case">Assets</span>
              </h1>
              <p className="text-gray-400 font-medium text-xl max-w-xl italic">
                A curated selection of authenticated lots within the <span className="text-navy font-bold">{categoryName}</span> category.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200">
               <div className="flex bg-white rounded-xl shadow-sm p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-navy text-white' : 'text-gray-400 hover:text-navy'}`}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="lg:w-72 shrink-0">
             <div className="sticky top-24 space-y-10">
                <div>
                   <h3 className="text-sm font-black text-navy uppercase tracking-[0.1em] mb-6 flex items-center justify-between">
                      Refine Catalogue <SlidersHorizontal className="h-3 w-3 text-gold" />
                   </h3>
                   
                   <div className="space-y-6">
                      <div>
                         <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Auction Status</p>
                         <div className="space-y-2">
                            {['all', 'live', 'scheduled', 'ended'].map((status) => (
                               <button
                                 key={status}
                                 onClick={() => setStatusFilter(status)}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${statusFilter === status ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                               >
                                  <span className="capitalize">{status === 'all' ? 'All Auctions' : status === 'live' ? 'Live Now' : status === 'scheduled' ? 'Coming Soon' : 'Archived'}</span>
                                  {statusFilter === status && <div className="h-1.5 w-1.5 bg-gold rounded-full" />}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Specialist Box */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full -translate-y-10 translate-x-10" />
                         <Shield className="h-6 w-6 text-burgundy mb-4" />
                         <p className="text-sm font-black text-navy uppercase tracking-widest mb-2">Expert Curation</p>
                         <p className="text-sm text-gray-400 leading-relaxed italic">Our department specialists have vetted every auction in this category for authenticity and provenance.</p>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Main Results Area */}
          <main className="flex-grow">
            {isLoading && auctions.length === 0 ? (
               <GenericGridSkeleton count={4} cols="grid-cols-1 md:grid-cols-2" />
            ) : auctions.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-6"}>
                {auctions.map(a => (
                  <AuctionCard key={a._id} auction={a} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                   <Package className="h-10 w-10 text-gray-200" />
                </div>
                <h2 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">Catalogue Empty</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto italic">There are currently no active auctions in this department. Please check our upcoming calendar or explore related categories.</p>
                <div className="flex justify-center gap-4">
                   <button 
                     onClick={() => setStatusFilter('all')}
                     className="btn-outline-secondary !rounded-full !px-8 !py-3"
                   >
                     Reset Filters
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