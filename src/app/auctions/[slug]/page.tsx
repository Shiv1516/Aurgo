"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, Heart, Share2, Clock, ChevronLeft, 
  ChevronRight, Trophy, ArrowRight,
  MapPin, Calendar, Shield, Award, Globe, CheckCircle, History as HistoryIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { auctionAPI, lotAPI, watchlistAPI, orderAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { joinAuction, leaveAuction } from "@/lib/socket";
import { Auction, Lot } from "@/types";
import PriceDisplay from "@/components/common/PriceDisplay";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import BidPanel from "@/components/bidding/BidPanel";
import CountdownTimer from "@/components/common/CountdownTimer";
import { DetailSkeleton } from "@/components/common/Skeletons";
import LotCard from "@/components/auction/LotCard";
import { formatDate, getAuctionStatusColor, getAssetUrl } from "@/lib/utils";

export default function AuctionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [auction, setAuction] = useState<(Auction & { lots?: Lot[] }) | null>(
    null,
  );
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState('description');
   const [selectedImage, setSelectedImage] = useState(0);
   const [wonOrderId, setWonOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && auction?._id) {
       orderAPI.getMyOrders({ limit: 100 }).then(res => {
          const orders = res.data.data || [];
          const wonOrder = orders.find((o: any) => o.lot?.auction === auction._id || (o.lot && auction.lots?.some(l => l._id === o.lot?._id)));
          if (wonOrder) setWonOrderId(wonOrder._id);
       }).catch(() => {});
    }
  }, [isAuthenticated, auction]);

  useEffect(() => {
    const slug = params.slug as string;
    auctionAPI
      .getBySlug(slug)
      .then((res) => {
        setAuction(res.data.data);
        const lotId = searchParams.get("lot");
        if (lotId && res.data.data.lots) {
          const lot = res.data.data.lots.find((l: Lot) => l._id === lotId);
          if (lot) setSelectedLot(lot);
        }
      })
      .catch(() => toast.error("Critical transmission error"))
      .finally(() => setIsLoading(false));
  }, [params.slug, searchParams]);

  useEffect(() => {
    if (auction?._id) {
      const socket = joinAuction(auction._id);
      
      socket.on('bid:new', (data: any) => {
        // Update the lot in the auction's lots array
        setAuction(prev => {
          if (!prev || !prev.lots) return prev;
          const updatedLots = prev.lots.map(l => {
            if (l._id === data.lotId) {
              return { ...l, currentBid: data.amount, totalBids: data.totalBids };
            }
            return l;
          });
          return { ...prev, lots: updatedLots };
        });

        // Update selectedLot if it's the one that received the bid
        if (selectedLot && selectedLot._id === data.lotId) {
          setSelectedLot(prev => prev ? { ...prev, currentBid: data.amount, totalBids: data.totalBids } : null);
          setBidHistory(prev => [data, ...prev].slice(0, 50));
        }

        // Update global auction stats if needed
        setAuction(prev => prev ? { ...prev, totalBids: (prev.totalBids || 0) + 1 } : null);
      });

      if (isAuthenticated) {
        watchlistAPI
          .check(auction._id)
          .then((res) => {
            setIsWatching(res.data.isWatching);
            if (res.data.data) setWatchId(res.data.data._id);
          })
          .catch(() => {});
      }
      return () => {
        leaveAuction(auction._id);
        socket.off('bid:new');
      };
    }
  }, [auction?._id, isAuthenticated, selectedLot?._id]);

  useEffect(() => {
    if (selectedLot) {
      lotAPI
        .getBidHistory(selectedLot._id)
        .then((res) => setBidHistory(res.data.data || []))
        .catch(() => {});
    }
  }, [selectedLot]);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed");
      return;
    }
    try {
      if (isWatching) {
        await watchlistAPI.remove(watchId);
        setIsWatching(false);
        toast.success("Removed");
      } else {
        const res = await watchlistAPI.add({ auctionId: auction!._id });
        setIsWatching(true);
        setWatchId(res.data.data._id);
        toast.success("Added");
      }
    } catch {
      toast.error("Critical transmission error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading)
    return <DetailSkeleton />;
  if (!auction)
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500 text-xl">Critical transmission error</p>
        </div>
      </>
    );

  const lots = auction.lots || [];
  const client = typeof auction.client === "object" ? auction.client : null;

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
         <Breadcrumbs 
           items={[
             { label: 'Auctions', href: '/auctions' },
             { label: auction?.title || 'Loading...', active: true }
           ]} 
         />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`${getAuctionStatusColor(auction.status)} text-white text-sm px-3 py-1 rounded font-bold uppercase tracking-widest`}
                >
                  {auction.status === "live" ? "Active" : auction.status === "scheduled" ? "Upcoming" : "Closed"}
                </span>
                {auction.isFeatured && (
                  <span className="bg-burgundy text-white text-sm px-3 py-1 rounded font-bold uppercase tracking-widest">
                    FEATURED
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-navy leading-tight mb-4">
                {auction.title}
              </h1>
              {client && (
                <p className="text-burgundy font-bold uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  {client.companyName || client.fullName}
                </p>
              )}
              <p className="text-gray-500 text-xl font-medium leading-relaxed mb-8 max-w-3xl">
                {auction.shortDescription || auction.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-base font-bold text-gray-400 uppercase tracking-wider">
                {auction.location?.city && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-navy" />
                    {auction.location.city}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-navy" />
                  {formatDate(auction.startTime)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-navy" />
                  {auction.totalLots} Lots Total
                </span>
              </div>
            </div>
            <div className="lg:w-80 space-y-6">
              {(auction.status === "live" ||
                auction.status === "scheduled") && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <p className="text-gray-400 text-sm font-black uppercase tracking-[0.1em] mb-3">
                    {auction.status === "live" ? "Active Distribution" : "Strategic Launch"}
                  </p>
                  <CountdownTimer
                    endTime={
                      auction.status === "live"
                        ? auction.endTime
                        : auction.startTime
                    }
                    variant="large"
                  />
                </div>
              )}
              <div className="flex flex-col gap-3">
                <button
                  onClick={toggleWatchlist}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${isWatching ? "bg-navy text-white" : "bg-white border-2 border-navy text-navy hover:bg-navy hover:text-white"}`}
                >
                  <Heart
                    className={`h-4 w-4 ${isWatching ? "fill-current" : ""}`}
                  />
                  {isWatching ? "Watching" : "Watchlist"}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-navy hover:text-navy transition-all font-black text-sm uppercase tracking-widest"
                >
                  <Share2 className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lots grid / selected lot */}
          <div className="flex-1">
            {selectedLot ? (
              <div>
                <button
                  onClick={() => {
                    setSelectedLot(null);
                    setBidHistory([]);
                  }}
                  className="flex items-center gap-1 text-burgundy mb-6 hover:text-burgundy-dark font-black text-sm uppercase tracking-widest"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                {/* Won Lot Banner */}
      {wonOrderId && (
         <motion.div 
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="mb-8 bg-gold/10 border border-gold/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
         >
            <div className="flex items-center gap-4 text-center md:text-left">
               <div className="h-14 w-14 bg-gold rounded-full flex items-center justify-center text-navy shadow-lg shadow-gold/20 shrink-0">
                  <Trophy className="h-7 w-7" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-navy uppercase tracking-tight">Acquisition <span className="text-gold">Settlement Ready</span></h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-0.5">You have won a lot in this auction. Finalize your collection settlement.</p>
               </div>
            </div>
            <Link 
              href={`/checkout/${wonOrderId}`}
              className="bg-navy text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-burgundy transition-all shadow-xl shadow-navy/10 flex items-center gap-2 whitespace-nowrap"
            >
               Finalize Acquisition <ArrowRight className="h-4 w-4" />
            </Link>
         </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Images */}
                  <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative mb-3">
                      {selectedLot.images?.[selectedImage]?.url ? (
                        <Image
                          src={getAssetUrl(selectedLot.images[selectedImage].url)}
                          alt={selectedLot.title}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gavel className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    {selectedLot.images && selectedLot.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {selectedLot.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? "border-burgundy" : "border-gray-200"}`}
                          >
                            <Image
                              src={getAssetUrl(img.url)}
                              alt=""
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Lot details */}
                  <div>
                    <span className="text-base text-gray-500">
                      Lot {selectedLot.lotNumber}
                    </span>
                    <h2 className="text-3xl font-heading font-bold text-dark mt-1 mb-2">
                      {selectedLot.title}
                    </h2>
                    {selectedLot.artist && (
                      <p className="text-burgundy font-medium mb-3">
                        {selectedLot.artist}
                      </p>
                    )}
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {selectedLot.description}
                    </p>

                    {/* Professional Info Tabs */}
                    <div className="mt-8 border-b border-gray-200 flex gap-8">
                       {['description', 'condition', 'shipping'].map((tab) => (
                          <button
                             key={tab}
                             onClick={() => setActiveTab(tab)}
                             className={`pb-4 text-sm font-black uppercase tracking-[0.1em] transition-all relative ${activeTab === tab ? 'text-burgundy' : 'text-gray-400 hover:text-navy'}`}
                          >
                             {tab}
                             {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy" />}
                          </button>
                       ))}
                    </div>

                    <div className="py-6">
                       {activeTab === 'description' && (
                          <div className="animate-fade-in">
                             <p className="text-gray-600 text-base leading-relaxed mb-6">
                                {selectedLot.description}
                             </p>
                          </div>
                       )}

                       {activeTab === 'condition' && (
                          <div className="animate-fade-in space-y-4">
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h4 className="text-base font-black text-navy uppercase tracking-tight flex items-center gap-2 mb-3">
                                   <Shield className="h-4 w-4 text-burgundy" /> Institutional Authentication
                                </h4>
                                <p className="text-base text-gray-600 leading-relaxed italic">
                                   {selectedLot.conditionReport || "This lot has been rigorously audited by our executive valuation guild. Condition remains consistent with archival standards."}
                                </p>
                             </div>
                             {selectedLot.provenance && (
                                <div>
                                   <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Provenance</h4>
                                   <p className="text-base text-gray-600">{selectedLot.provenance}</p>
                                </div>
                             )}
                          </div>
                       )}

                       {activeTab === 'shipping' && (
                          <div className="animate-fade-in space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 rounded-xl">
                                   <h5 className="text-sm font-black text-navy uppercase tracking-widest mb-1">Global Distribution</h5>
                                   <p className="text-sm text-gray-500">Secure, insured transit available via our executive logistics network.</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl">
                                   <h5 className="text-sm font-black text-navy uppercase tracking-widest mb-1">Vault Logistics</h5>
                                   <p className="text-sm text-gray-500">Tailored white-glove settlement and jurisdictional management.</p>
                                </div>
                             </div>
                             <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-center mt-4">Import duties and jurisdictional taxes are the member's responsibility.</p>
                          </div>
                       )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 mb-2">
                       <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-black text-navy uppercase">Verified</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <Shield className="h-4 w-4 text-burgundy" />
                          <span className="text-sm font-black text-navy uppercase">Vault Protected</span>
                       </div>
                    </div>

                    {bidHistory.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-700 mb-2">
                          History ({bidHistory.length})
                        </h4>
                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                          {bidHistory.map((b: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-base py-1.5 border-b border-gray-200 gap-4"
                            >
                              <span className="text-gray-600">
                                {b.bidderName}
                              </span>
                              <div className="flex items-center gap-3">
                                <PriceDisplay amount={b.amount} size="base" variant="navy" align="right" />
                                {b.isWinning && (
                                  <span className="text-green-600 text-sm font-medium">
                                    Leading
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="section-title mb-10">Lot Selection <span className="text-burgundy">({lots.length})</span></h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lots.map((lot) => (
                    <div
                      key={lot._id}
                      onClick={() => {
                        setSelectedLot(lot);
                        setSelectedImage(0);
                      }}
                      className="cursor-pointer"
                    >
                      <LotCard lot={lot} auctionSlug={auction.slug} />
                    </div>
                  ))}
                </div>
                {lots.length === 0 && (
                  <p className="text-center py-12 text-gray-500">
                    No lots initialized in this catalogue.
                  </p>
                )}
              </div>
            )}
          </div>

          {selectedLot && (
            <div className="lg:w-96 lg:sticky lg:top-24 lg:self-start">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center">
                        <Award className="h-7 w-7 text-gold" />
                     </div>
                     <span className="text-sm font-black text-gray-500 uppercase mt-2">Verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center">
                        <Shield className="h-7 w-7 text-burgundy" />
                     </div>
                     <span className="text-sm font-black text-gray-500 uppercase mt-2">Protected</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center">
                        <Globe className="h-7 w-7 text-accent" />
                     </div>
                     <span className="text-sm font-black text-gray-500 uppercase mt-2">Escrow</span>
                  </div>
               </div>

              <BidPanel
                lot={selectedLot}
                auctionEndTime={auction.endTime}
                auctionStatus={auction.status}
                buyersPremium={auction.buyersPremium}
              />
              
              <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                 <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HistoryIcon className="h-3 w-3 text-gold" /> Increment Strategy
                 </h4>
                 <p className="text-sm text-gray-500 leading-relaxed italic">
                    Bids increase in institutional increments. A buyer's premium of {auction.buyersPremium}% applies to the hammer price.
                 </p>
              </div>
            </div>
          )}
        </div>

        {!selectedLot && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-heading font-bold text-dark mb-4">
                About This Sale
              </h3>
              <div
                className="prose prose-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: auction.description }}
              />
              {auction.termsAndConditions && (
                <div className="mt-8">
                  <h4 className="text-xl font-heading font-bold text-dark mb-3">
                    Terms of Acquisition
                  </h4>
                  <p className="text-base text-gray-600 whitespace-pre-wrap">
                    {auction.termsAndConditions}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="card p-6">
                <h4 className="font-heading font-semibold text-dark mb-4">
                   Audit Details
                </h4>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Category</span>
                    <span className="font-medium capitalize">
                      {auction.auctionType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Premium</span>
                    <span className="font-medium">
                      {auction.buyersPremium}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Settlement Currency</span>
                    <span className="font-medium">{auction.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Catalogued Lots</span>
                    <span className="font-medium">{auction.totalLots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Activities</span>
                    <span className="font-medium">{auction.totalBids}</span>
                  </div>
                </div>
                {client && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-dark mb-2">
                       Issuing Institution
                    </h5>
                    <p className="text-base text-burgundy font-medium">
                      {client.companyName}
                    </p>
                    {client.companyDescription && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                        {client.companyDescription}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
