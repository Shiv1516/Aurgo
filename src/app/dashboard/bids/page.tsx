"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { bidAPI } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { 
  Gavel, TrendingUp, TrendingDown, Target, Eye, 
  Activity, ArrowRight, ShieldCheck, Box, 
  ChevronRight, BarChart3, Clock
} from 'lucide-react';

const tabs = ['all', 'winning', 'outbid', 'won', 'lost'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function BidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params: any = { limit: 50 };
    if (activeTab !== 'all') params.status = activeTab;
    bidAPI.getMyBids(params)
      .then(res => setBids(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  const statusStyle = (s: string) => {
    switch (s) { 
      case 'winning': return 'bg-green-50 text-green-600 border-green-100'; 
      case 'outbid': return 'bg-rose-50 text-rose-600 border-rose-100'; 
      case 'won': return 'bg-burgundy/10 text-burgundy border-burgundy/20'; 
      case 'lost': return 'bg-gray-50 text-gray-400 border-gray-100'; 
      default: return 'bg-navy/5 text-navy/40 border-navy/10'; 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Activity Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span className="w-1.5 h-1.5 bg-navy rounded-full" />
             </div>
             <span className="text-sm font-black text-navy/40 uppercase tracking-[0.4em]">Live Participation Feed</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Strategic <span className="text-burgundy italic font-serif lowercase">Engagements</span>
          </h1>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-gray-100 shadow-xl shadow-black/5">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-gray-400 hover:text-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden">
        {/* Subtle Movement Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burgundy via-gold to-navy opacity-30" />

        {isLoading ? <PageLoader /> : bids.length === 0 ? (
          <div className="py-32 text-center">
            <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Gavel className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Registry Silent</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">No active participation detected in the current sector</p>
            <Link href="/search" className="inline-flex items-center gap-2 mt-8 text-burgundy font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform">
               Deploy Bids <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400">Target Asset</th>
                  <th className="pb-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400">Strategic Sphere</th>
                  <th className="pb-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400">Your Commitment</th>
                  <th className="pb-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400">Engagement Status</th>
                  <th className="pb-6 text-right text-sm font-black uppercase tracking-[0.2em] text-gray-400">Surveillance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {bids.map((bid: any) => (
                    <motion.tr 
                      key={bid._id}
                      layout
                      variants={itemVariants}
                      className="group hover:bg-navy/[0.01] transition-colors"
                    >
                      <td className="py-8">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-700">
                            <img src={bid.lot?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-navy uppercase tracking-tight line-clamp-1">{bid.lot?.title || 'Anonymous Asset'}</p>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Lot Serial #{(bid.lot?.lotNumber || '000').toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-sm text-gray-300 font-black uppercase tracking-[0.2em] mb-1">Maison Collection</p>
                        <Link href={`/auctions/${bid.auction?.slug}`} className="text-sm font-black text-burgundy uppercase hover:underline tracking-tight">
                          {bid.auction?.title}
                        </Link>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-navy/20" />
                          <p className="text-lg font-black text-navy tracking-tighter">{formatCurrency(bid.amount)}</p>
                        </div>
                        <p className="text-sm text-gray-400 font-black uppercase tracking-widest mt-1">Pledged Liquidity</p>
                      </td>
                      <td className="py-8">
                        <div className="flex flex-col gap-2">
                          <span className={`text-sm font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm w-fit inline-flex items-center gap-2 ${statusStyle(bid.status)}`}>
                            {bid.status === 'winning' && <TrendingUp className="h-3 w-3 animate-bounce" />}
                            {bid.status === 'outbid' && <TrendingDown className="h-3 w-3" />}
                            {bid.status}
                          </span>
                          <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter pl-1">
                             {timeAgo(bid.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 text-right">
                        <Link 
                          href={`/auctions/${bid.auction?.slug}`}
                          className="p-3 bg-gray-50 text-navy hover:bg-navy hover:text-white rounded-xl transition-all inline-flex opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 shadow-lg shadow-black/5"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Intelligence Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] group hover:border-gold transition-colors">
            <Activity className="h-8 w-8 text-burgundy mb-4" />
            <h4 className="text-base font-black text-navy uppercase mb-2">Real-time Telemetry</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Continuous monitoring of bid velocity and platform-wide engagement metrics.</p>
         </div>
         <div className="bg-navy rounded-[2.5rem] p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000">
               <ShieldCheck className="h-24 w-24" />
            </div>
            <ShieldCheck className="h-8 w-8 text-gold mb-4 relative z-10" />
            <h4 className="text-base font-black text-gold uppercase mb-2 relative z-10">Integrity Shield</h4>
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed relative z-10">Every commitment is cryptographically signed and legally binding within the Augeo Protocol.</p>
         </div>
         <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] group hover:border-burgundy transition-colors">
            <BarChart3 className="h-8 w-8 text-navy mb-4" />
            <h4 className="text-base font-black text-navy uppercase mb-2">Yield Projections</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Automated calculation of buyer premiums and anticipated final settlements.</p>
         </div>
      </div>
    </motion.div>
  );
}