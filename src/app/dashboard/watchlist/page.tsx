"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { watchlistAPI } from '@/lib/api';
import { PageLoader } from '@/components/common/LoadingSpinner';
import CountdownTimer from '@/components/common/CountdownTimer';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Heart, Trash2, Eye, Calendar, Clock } from 'lucide-react';

export default function WatchlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    watchlistAPI.getAll().then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
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

  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Private Curation</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Monitored Assets & Collection Highlights</p>
        </div>
        <Link 
          href="/auctions" 
          className="px-6 py-3 bg-dark text-gold rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-xl shadow-gold/10"
        >
          Discover New Spheres
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white min-h-[400px]">
        {items.length === 0 ? (
          <div className="py-20 text-center opacity-50 flex flex-col items-center justify-center h-full">
            <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Your Private Gallery is Empty</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Curate assets from live auctions to monitor them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item: any) => {
              const auction = item.auction;
              if (!auction) return null;
              return (
                <div key={item._id} className="group relative bg-white rounded-[2rem] border border-gray-50 hover:border-gold/30 hover:shadow-2xl hover:shadow-black/[0.05] transition-all p-5 flex gap-6">
                  {/* Image/Asset Preview */}
                  <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100/50">
                    <img src={auction.coverImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/auctions/${auction.slug}`} className="text-xs font-black text-dark uppercase hover:text-gold transition-colors line-clamp-1 pr-6">
                          {auction.title}
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 mb-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border ${
                          auction.status === 'live' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {auction.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {auction.status === 'live' ? 'Ends in' : 'Starts in'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl inline-block">
                        <CountdownTimer endTime={auction.status === 'live' ? auction.endTime : auction.startTime} variant="compact" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                         <Calendar className="h-3 w-3" />
                         {formatDate(auction.endTime)}
                       </div>
                       
                       <div className="flex items-center gap-2">
                        <button 
                          onClick={() => removeItem(item._id)} 
                          className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link 
                          href={`/auctions/${auction.slug}`}
                          className="p-2 bg-dark text-gold hover:bg-gold hover:text-white rounded-xl transition-all shadow-lg shadow-black/5"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}