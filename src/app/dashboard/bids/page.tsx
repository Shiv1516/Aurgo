"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bidAPI } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Gavel, TrendingUp, TrendingDown, Target, Eye } from 'lucide-react';

const tabs = ['all', 'winning', 'outbid', 'won', 'lost'];

export default function BidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params: any = { limit: 50 };
    if (activeTab !== 'all') params.status = activeTab;
    bidAPI.getMyBids(params).then(res => setBids(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, [activeTab]);

  const statusStyle = (s: string) => {
    switch (s) { 
      case 'winning': return 'bg-green-50 text-green-600 border-green-100'; 
      case 'outbid': return 'bg-rose-50 text-rose-600 border-rose-100'; 
      case 'won': return 'bg-gold/10 text-gold border-gold/20'; 
      case 'lost': return 'bg-gray-50 text-gray-400 border-gray-100'; 
      default: return 'bg-blue-50 text-blue-600 border-blue-100'; 
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">High-Stakes Activity</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Live Bidding & Acquisition Feed</p>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100/50">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-dark text-gold shadow-lg shadow-black/10' : 'text-gray-400 hover:text-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {isLoading ? <PageLoader /> : bids.length === 0 ? (
          <div className="py-20 text-center opacity-50">
            <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Gavel className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Engagements</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sphere</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Engagement</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bids.map((bid: any) => (
                  <tr key={bid._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img src={bid.lot?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-dark uppercase line-clamp-1">{bid.lot?.title || 'Lot Asset'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lot {bid.lot?.lotNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Collection</p>
                      <Link href={`/auctions/${bid.auction?.slug}`} className="text-[10px] font-black text-gold uppercase hover:underline">
                        {bid.auction?.title}
                      </Link>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-gold" />
                        <p className="text-sm font-black text-dark">{formatCurrency(bid.amount)}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Your Commitment</p>
                    </td>
                    <td className="py-6">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${statusStyle(bid.status)} inline-flex items-center gap-1.5`}>
                        {bid.status === 'winning' && <TrendingUp className="h-2.5 w-2.5" />}
                        {bid.status === 'outbid' && <TrendingDown className="h-2.5 w-2.5" />}
                        {bid.status}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <Link 
                        href={`/auctions/${bid.auction?.slug}`}
                        className="p-2.5 bg-gray-50 text-dark hover:bg-dark hover:text-gold rounded-xl transition-all inline-flex opacity-0 group-hover:opacity-100 shadow-xl shadow-black/5"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}