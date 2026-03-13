'use client';

import { useState, useEffect } from 'react';
import { Lot, Bid } from '@/types';
import { formatCurrency, getMinimumBid } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { bidAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import CountdownTimer from '@/components/common/CountdownTimer';
import toast from 'react-hot-toast';
import { Gavel, AlertTriangle, Shield, Clock, CheckCircle, ChevronLeft, ArrowRight } from 'lucide-react';

interface BidPanelProps {
  lot: Lot;
  auctionEndTime: string;
  auctionStatus: string;
  buyersPremium: number;
  onBidPlaced?: (bid: Bid) => void;
}

export default function BidPanel({ lot, auctionEndTime, auctionStatus, buyersPremium, onBidPlaced }: BidPanelProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [bidAmount, setBidAmount] = useState('');
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [showAutoBid, setShowAutoBid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'entry' | 'confirmation' | 'success'>('entry');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // We now rely on lot props which are updated by the parent via Sockets
  const currentBid = lot.currentBid;
  const totalBids = lot.totalBids;

  const minimumBid = getMinimumBid(currentBid, lot.startingBid, lot.bidIncrement);
  const isLive = auctionStatus === 'live';
  const isUserHighestBidder = lot.currentBidder && user && (typeof lot.currentBidder === 'string' ? lot.currentBidder === user._id : lot.currentBidder._id === user._id);

  useEffect(() => {
    setBidAmount(minimumBid.toString());
  }, [minimumBid]);

  const handleNextStep = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place a bid');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      toast.error(`Minimum bid is ${formatCurrency(minimumBid)}`);
      return;
    }

    setCurrentStep('confirmation');
  };

  const confirmBid = async () => {
    if (!agreedToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: any = {
        lotId: lot._id,
        amount: parseFloat(bidAmount),
      };

      if (showAutoBid && maxAutoBid) {
        data.maxAutoBid = parseFloat(maxAutoBid);
      }

      const res = await bidAPI.placeBid(data);
      toast.success(`Bid placed successfully!`);
      setCurrentStep('success');
      if (onBidPlaced) onBidPlaced(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementBid = () => {
    const current = parseFloat(bidAmount) || minimumBid;
    setBidAmount((current + lot.bidIncrement).toString());
  };

  const decrementBid = () => {
    const current = parseFloat(bidAmount) || minimumBid;
    const newAmount = current - lot.bidIncrement;
    if (newAmount >= minimumBid) {
      setBidAmount(newAmount.toString());
    }
  };

  const calculatedPremium = (parseFloat(bidAmount) || 0) * (buyersPremium / 100);
  const totalWithPremium = (parseFloat(bidAmount) || 0) + calculatedPremium;

  if (currentStep === 'success') {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-black text-navy uppercase tracking-tighter mb-2">Bid Submitted</h3>
        <p className="text-gray-500 text-base mb-8">Your bid of <span className="text-navy font-bold">{formatCurrency(parseFloat(bidAmount))}</span> has been successfully registered.</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
           <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 font-bold uppercase tracking-widest">Status</span>
              <span className="text-green-600 font-black uppercase tracking-widest">Leading</span>
           </div>
           <p className="text-sm text-gray-400">You will be notified immediately if you are outbid.</p>
        </div>

        <button 
          onClick={() => setCurrentStep('entry')}
          className="btn-primary w-full !rounded-xl !py-4"
        >
          View Bid Status
        </button>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-navy p-6 text-white">
           <button onClick={() => setCurrentStep('entry')} className="text-sm font-black uppercase tracking-widest text-gold hover:text-white transition-colors mb-4 flex items-center gap-2">
              <ChevronLeft className="h-3 w-3" /> Back to Edit
           </button>
           <h3 className="text-2xl font-black uppercase tracking-tighter">Review Your Bid</h3>
        </div>
        
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <span className="text-base text-gray-400 font-bold uppercase tracking-widest">Hammer Price</span>
              <span className="text-2xl font-black text-navy">{formatCurrency(parseFloat(bidAmount))}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <span className="text-base text-gray-400 font-bold uppercase tracking-widest">Buyer&apos;s Premium ({buyersPremium}%)</span>
              <span className="text-base font-bold text-navy">{formatCurrency(calculatedPremium)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base text-navy font-black uppercase tracking-widest">Total Commitment</span>
              <span className="text-3xl font-black text-burgundy">{formatCurrency(totalWithPremium)}</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-100">
             <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Legal Notice</p>
                   <p className="text-sm text-amber-800 leading-relaxed">By confirming, you enter a legally binding contract to pay the hammer price plus premium and taxes should you be the winning bidder.</p>
                </div>
             </div>
          </div>

          <label className="flex items-start gap-3 mb-8 cursor-pointer group">
             <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-burgundy focus:ring-burgundy"
             />
             <span className="text-sm text-gray-500 font-medium group-hover:text-navy transition-colors">
                I acknowledge the terms of sale and my financial responsibility for this bid.
             </span>
          </label>

          <button
            onClick={confirmBid}
            disabled={isSubmitting || !agreedToTerms}
            className="btn-primary w-full !py-5 !text-xl !rounded-2xl disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Place My Bid'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
      <div className="bg-navy p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white/60 text-sm font-black uppercase tracking-[0.2em]">
              {isLive ? 'Bidding Live' : 'Bidding Closed'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-sm font-bold">
            <Gavel className="h-3 w-3" />
            <span>{totalBids} Bids</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
           <div>
              <p className="text-gold font-black text-sm uppercase tracking-widest mb-1">Current Highest Bid</p>
              <div className="text-4xl font-black text-white tracking-tighter">
                {formatCurrency(currentBid > 0 ? currentBid : lot.startingBid)}
              </div>
           </div>
           {lot.estimateLow && (
              <div className="text-right">
                 <p className="text-white/40 text-sm font-black uppercase tracking-[0.2em] mb-1">Estimate</p>
                 <p className="text-sm font-bold text-white/80">{formatCurrency(lot.estimateLow)} - {formatCurrency(lot.estimateHigh || 0)}</p>
              </div>
           )}
        </div>
      </div>

      {/* Countdown Warning */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-burgundy" />
            <span className="text-sm font-black text-navy uppercase tracking-widest">Ending In</span>
         </div>
         <CountdownTimer endTime={auctionEndTime} variant="compact" />
      </div>

      {/* Bid form */}
      <div className="p-8">
        {isLive && lot.status === 'active' ? (
          <>
            {isUserHighestBidder && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8 flex items-center gap-3 animate-fade-in">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                   <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                   <p className="text-sm font-black text-green-700 uppercase tracking-widest">You are leading</p>
                   <p className="text-sm text-green-600">You are currently the highest bidder.</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Place Your Bid</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={decrementBid} 
                  className="h-14 w-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-3xl font-black text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
                >
                  -
                </button>
                <div className="relative flex-1">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/20 font-black">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minimumBid}
                    step={lot.bidIncrement}
                    className="w-full pl-10 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-gold transition-all text-center text-2xl font-black text-navy"
                  />
                </div>
                <button 
                  onClick={incrementBid} 
                  className="h-14 w-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-3xl font-black text-navy hover:bg-navy hover:text-white hover:border-navy transition-all"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between mt-3 text-sm font-bold uppercase tracking-widest text-gray-400">
                 <span>Min: {formatCurrency(minimumBid)}</span>
                 <span>Inc: {formatCurrency(lot.bidIncrement)}</span>
              </div>
            </div>

            {/* Auto-bid option refined */}
            {lot.autoBidEnabled && (
              <div className="mb-8">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-navy uppercase tracking-widest">Proxy Bidding</span>
                    <button
                      onClick={() => setShowAutoBid(!showAutoBid)}
                      className="text-sm font-black text-gold uppercase tracking-widest border-b border-gold/20"
                    >
                      {showAutoBid ? 'Cancel' : 'Set Maximum'}
                    </button>
                 </div>
                {showAutoBid && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/20 font-black">$</span>
                      <input
                        type="number"
                        value={maxAutoBid}
                        onChange={(e) => setMaxAutoBid(e.target.value)}
                        min={minimumBid}
                        className="w-full pl-10 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-gold transition-all text-base font-bold text-navy"
                        placeholder="Enter max proxy amount"
                      />
                    </div>
                    <p className="text-sm text-gray-400 italic">Our system will automatically outbid others up to your limit.</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="btn-primary w-full !py-5 !text-base !rounded-2xl shadow-xl shadow-burgundy/20 group"
            >
              {isSubmitting ? 'Processing...' : (
                <span className="flex items-center justify-center gap-2">
                   Review Commitment <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            {auctionStatus === 'scheduled' ? (
              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Clock className="h-8 w-8 text-navy/20" />
                </div>
                <p className="text-navy font-black uppercase tracking-tight mb-2">Auction Not Yet Live</p>
                <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">Bidding will open automatically when the countdown expires.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Gavel className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-tight mb-2">Bidding Concluded</p>
                <p className="text-sm text-gray-400">
                  {lot.status === 'sold' ? `Hammered at ${formatCurrency(lot.winningBid || lot.currentBid)}` : 'This lot has ended unswept.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
