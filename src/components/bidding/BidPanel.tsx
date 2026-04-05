"use client";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { lotAPI, bidAPI } from "@/lib/api";
import PriceDisplay from "@/components/common/PriceDisplay";
import toast from "react-hot-toast";
import { Gavel, Clock, ShieldCheck, TrendingUp, ChevronRight, Scale, History, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";

interface BidPanelProps {
  lot: any;
  onBidPlace?: () => void;
  auctionEndTime?: string;
  auctionStatus?: string;
  buyersPremium?: number;
}

export default function BidPanel({ 
  lot, 
  onBidPlace,
  auctionEndTime,
  auctionStatus,
  buyersPremium
}: BidPanelProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [currentBid, setCurrentBid] = useState(lot.currentBid || 0);
  const [bidCount, setBidCount] = useState(lot.bidCount || 0);
  const [bids, setBids] = useState<any[]>(lot.bids || []);
  const [timeLeft, setTimeLeft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentBid(lot.currentBid || 0);
    setBidCount(lot.bidCount || 0);
    setBids(lot.bids || []);
  }, [lot]);

  const [isWinning, setIsWinning] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    
    socket.on('notification', (data) => {
      if (data.type === 'new_bid' && data.lot === lot._id) {
        setCurrentBid(data.amount);
        setBidCount((prev: number) => prev + 1);
        setBids(prev => [{
          bidder: { name: data.bidderName },
          amount: data.amount,
          createdAt: new Date()
        }, ...prev]);
        
        if (data.bidder === user?._id) {
          setIsWinning(true);
          toast.success("High bid confirmed!");
        } else {
          setIsWinning(false);
          toast.success("New bid received!");
        }
      }
    });

    return () => {
      socket.off('notification');
    };
  }, [lot._id, user?._id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (lot.endDate) {
        const end = new Date(lot.endDate);
        if (end < new Date()) {
          setTimeLeft("Auction Ended");
        } else {
          setTimeLeft(formatDistanceToNow(end, { addSuffix: true }));
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lot.endDate]);

  const handleBid = async () => {
    if (!isAuthenticated) {
      toast.error("Authentication required to commit bids");
      return;
    }
    if (!bidAmount || bidAmount <= currentBid) {
      toast.error(`Minimum commitment: ${currentBid + 1} EUR`);
      return;
    }

    setIsPlacing(true);
    try {
      await bidAPI.placeBid({ lotId: lot._id, amount: Number(bidAmount) });
      setBidAmount("");
      onBidPlace?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Strategic transmission failed");
    } finally {
      setIsPlacing(false);
    }
  };

  const getMinNextBid = () => {
    const current = currentBid || lot.startingBid || 0;
    if (current < 100) return current + 10;
    if (current < 500) return current + 25;
    if (current < 1000) return current + 50;
    return current + 100;
  };

  const setSuggestedBid = (multiplier: number) => {
     setBidAmount(Math.ceil(getMinNextBid() * multiplier));
  };

  return (
    <div className="card rounded-2xl overflow-hidden border-navy/10 shadow-2xl relative">
      {/* Dynamic Header */}
      <div className={`p-6 bg-navy text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-full gold-gradient opacity-10 skew-x-12 translate-x-16" />
        <div className="relative z-10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Bidding Terminal</span>
           </div>
           <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <Clock className="h-3 w-3 text-gold" />
              <span className="text-xs font-bold uppercase tracking-widest">{timeLeft}</span>
           </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Pricing Matrix */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span className="text-sm font-black text-navy uppercase tracking-widest">Active Multi-Bidding</span>
           </div>
           
           <div className="flex items-end justify-between gap-4 pb-2">
              <div className="min-w-0 flex-1 overflow-hidden">
                 <p className="text-gold font-black text-sm uppercase tracking-widest mb-1 truncate">Current Bid</p>
                 <div className="flex items-center gap-3">
                    <PriceDisplay 
                      amount={currentBid > 0 ? currentBid : lot.startingBid} 
                      size="4xl" 
                      variant="white" 
                    />
                    {isWinning && (
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         className="h-10 w-10 bg-gold rounded-full flex items-center justify-center text-navy shadow-lg shadow-gold/40"
                       >
                          <Trophy className="h-5 w-5" />
                       </motion.div>
                    )}
                 </div>
              </div>
              {lot.estimateLow && (
                 <div className="text-right flex flex-col items-end min-w-0 overflow-hidden">
                    <p className="text-white/40 text-sm font-black uppercase tracking-[0.1em] mb-1 truncate">Estimate</p>
                    <div className="flex items-center gap-2 text-white/80 font-bold max-w-full">
                       <PriceDisplay amount={lot.estimateLow} size="sm" variant="white" align="right" />
                       <span>-</span>
                       <PriceDisplay amount={lot.estimateHigh || 0} size="sm" variant="white" align="right" />
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Commitment Interface */}
        <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 space-y-6 shadow-inner">
           <div className="flex items-center justify-between">
              <span className="text-sm font-black text-navy uppercase tracking-widest">Commitment Zone</span>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Secure Protocol
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 1.1, 1.25].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSuggestedBid(m)}
                    className="flex-1 py-3 px-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-navy uppercase tracking-widest hover:border-gold hover:text-gold transition-all shadow-sm"
                  >
                    +{Math.round((m-1)*100)}%
                  </button>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                   <Gavel className="h-5 w-5 text-gray-300 group-focus-within:text-gold transition-colors" />
                </div>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  placeholder={`${getMinNextBid()} EUR or higher`}
                  className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-200 rounded-xl focus:border-gold outline-none transition-all font-black text-lg placeholder:text-gray-200"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                   <div className="text-xs font-black text-gray-300 uppercase tracking-widest">Magnitude</div>
                </div>
              </div>

              <button
                onClick={handleBid}
                disabled={isPlacing || (bidAmount || 0) <= currentBid}
                className="w-full bg-gold text-navy py-5 rounded-xl font-black text-base uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(201,168,76,0.3)] group"
              >
                {isPlacing ? "Processing..." : "Place Commitment"}
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

        {/* Provenance Stream */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                 <History className="h-4 w-4 text-gold" /> History
              </h4>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{bidCount} activities</span>
           </div>

           <div ref={scrollRef} className="max-h-[250px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
             <AnimatePresence initial={false}>
               {bids.length > 0 ? (
                 bids.map((bid, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all group"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center font-black text-navy group-hover:bg-gold/10 transition-colors">
                           {bid.bidder?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                           <p className="text-sm font-black text-navy uppercase tracking-tighter">{bid.bidder?.name || 'Anonymous Collector'}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                              {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <PriceDisplay amount={bid.amount} size="lg" variant="navy" align="right" />
                        <div className="text-[10px] text-green-600 font-black uppercase tracking-[0.1em]">Confirmed</div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-30">
                    <History className="h-12 w-12 text-navy" />
                    <p className="text-xs font-black uppercase tracking-widest">No Provenance Stream Yet</p>
                 </div>
               )}
             </AnimatePresence>
           </div>
        </div>

        {/* Global Assurance */}
        <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy/5 flex items-center justify-center">
                 <Scale className="h-5 w-5 text-burgundy" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Legal Hold</p>
                 <p className="text-xs font-bold text-navy uppercase">Binding Contract</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center">
                 <ShieldCheck className="h-5 w-5 text-gold" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vault Guard</p>
                 <p className="text-xs font-bold text-navy uppercase">Escrow Protection</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
