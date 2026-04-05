"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { watchlistAPI } from '@/lib/api';
import { PageLoader } from '@/components/common/LoadingSpinner';
import CountdownTimer from '@/components/common/CountdownTimer';
import { formatDate, getAssetUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import { 
  Heart, Trash2, Eye, Calendar, Clock, 
  Sparkles, ShieldCheck, ArrowRight, Activity,
  Globe, LayoutGrid, Timer, ChevronRight
} from 'lucide-react';
import { GenericGridSkeleton } from '@/components/common/Skeletons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function WatchlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    watchlistAPI.getAll()
      .then(res => setItems(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const removeItem = async (id: string) => {
    try { 
      await watchlistAPI.remove(id); 
      setItems(items.filter(i => i._id !== id)); 
      toast.success('Asset removed from curation'); 
    } catch { 
      toast.error('Failed to update watchlist'); 
    }
  };

  if (isLoading) return (
    <div className="space-y-12">
      <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-2xl" />
      <GenericGridSkeleton count={4} cols="grid-cols-1 xl:grid-cols-2" />
    </div>
  );
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Curation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span className="w-1.5 h-1.5 bg-navy rounded-full" />
             </div>
             <span className="text-sm font-black text-navy/40 uppercase tracking-[0.1em]">Personal Acquisition Filter</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Private <span className="text-burgundy italic font-serif lowercase">Curation</span>
          </h1>
        </div>
        
        <Link 
          href="/search" 
          className="flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/10 active:scale-95 group"
        >
          Discover New Spheres <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.03] border border-gray-200 min-h-[500px] relative overflow-hidden">
        {/* Gallery Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy/[0.02] rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/[0.02] rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none" />

        {items.length === 0 ? (
          <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-gray-50 rounded-xl flex items-center justify-center mb-8 shadow-inner overflow-hidden relative group">
              <div className="absolute inset-0 bg-navy/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Heart className="h-10 w-10 text-gray-200 relative z-10 group-hover:text-burgundy transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Portfolio Empty</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.1em] max-w-sm mx-auto leading-relaxed">
              Initiate your private collection by curating assets from our global live auctions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-8 relative z-10">
            <AnimatePresence mode="popLayout">
              {items.map((item: any) => {
                const auction = item.auction;
                if (!auction) return null;
                return (
                  <motion.div 
                    key={item._id}
                    layout
                    variants={itemVariants}
                    className="group relative bg-white rounded-xl border border-gray-200 hover:border-gold hover:shadow-2xl hover:shadow-black/[0.08] transition-all p-6 flex flex-col md:flex-row gap-8"
                  >
                    {/* Asset Preview */}
                    <div className="w-full md:w-48 h-48 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 shadow-inner group-hover:shadow-xl group-hover:shadow-navy/5 transition-all">
                      <img 
                        src={getAssetUrl(auction.coverImage)} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                    </div>

                    {/* Metadata Spectrum */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-sm font-black text-burgundy uppercase tracking-widest mb-1 block">Catalog Item</span>
                            <Link href={`/auctions/${auction.slug}`} className="text-xl font-black text-navy uppercase hover:text-burgundy transition-colors line-clamp-1 pr-8 tracking-tight">
                              {auction.title}
                            </Link>
                          </div>
                          <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-navy/20 group-hover:bg-gold group-hover:text-navy transition-all">
                             <Sparkles className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`text-sm font-black px-3 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${
                            auction.status === 'live' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-navy/5 text-navy/40 border-navy/10'
                          }`}>
                            {auction.status === 'live' && <span className="inline-block w-1 h-1 bg-rose-600 rounded-full animate-ping mr-2" />}
                            {auction.status}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm font-black uppercase tracking-tighter">
                              {auction.status === 'live' ? 'Final interval' : 'Pending start'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200 shadow-inner group-hover:bg-white transition-colors">
                          <CountdownTimer endTime={auction.status === 'live' ? auction.endTime : auction.startTime} variant="compact" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                         <div className="flex items-center gap-3 text-sm font-black text-navy/30 uppercase tracking-widest">
                           <Calendar className="h-3 w-3" />
                           {formatDate(auction.endTime)}
                         </div>
                         
                         <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeItem(item._id)} 
                            className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Purge Curation"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                          <Link 
                            href={`/auctions/${auction.slug}`}
                            className="flex items-center gap-2 bg-navy text-white pl-5 pr-4 py-3 hover:bg-gold hover:text-navy rounded-xl transition-all shadow-xl shadow-navy/10 active:scale-95"
                          >
                            <span className="text-sm font-black uppercase tracking-widest">Inspect</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Curation Intelligence Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-navy rounded-xl p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl group-hover:bg-burgundy/20 transition-all duration-1000" />
            <div className="relative z-10 flex items-start gap-6">
               <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold shadow-2xl">
                  <ShieldCheck className="h-7 w-7" />
               </div>
               <div>
                  <h4 className="text-2xl font-black uppercase tracking-tight mb-3">Integrity Monitoring</h4>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-[0.1em] leading-relaxed">
                     Automated surveillance of curated assets to ensure you never miss critical bidding intervals or provenance updates.
                  </p>
               </div>
            </div>
         </div>
         <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 group hover:bg-white hover:border-gold transition-all duration-500">
            <div className="flex items-start gap-6">
               <div className="h-14 w-14 bg-navy rounded-2xl flex items-center justify-center text-burgundy shadow-xl shadow-navy/5 group-hover:bg-burgundy group-hover:text-white transition-all">
                  <Activity className="h-7 w-7" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-navy uppercase tracking-tight mb-3">Yield Telemetry</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.1em] leading-relaxed">
                     Real-time calculation of market velocity and anticipated hammer prices for all items within your private curation.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}