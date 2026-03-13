"use client";
import { Socket } from "socket.io-client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import LotCard from "@/components/auction/LotCard";
import BidPanel from "@/components/bidding/BidPanel";
import CountdownTimer from "@/components/common/CountdownTimer";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { auctionAPI, lotAPI, watchlistAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { joinAuction, leaveAuction } from "@/lib/socket";
import { Auction, Lot, Bid } from "@/types";
import { formatCurrency, formatDate, getAuctionStatusColor } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Users,
  Gavel,
  Eye,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
   MessageSquare,
   Award,
   Globe,
   CheckCircle,
   History as HistoryIcon,
} from "lucide-react";

export default function AuctionDetailPage() {
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
      .catch(() => toast.error("Auction not found"))
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
      toast.error("Please sign in");
      return;
    }
    try {
      if (isWatching) {
        await watchlistAPI.remove(watchId);
        setIsWatching(false);
        toast.success("Removed from watchlist");
      } else {
        const res = await watchlistAPI.add({ auctionId: auction!._id });
        setIsWatching(true);
        setWatchId(res.data.data._id);
        toast.success("Added to watchlist");
      }
    } catch {
      toast.error("Failed to update watchlist");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  if (!auction)
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500 text-xl">Auction not found</p>
        </div>
      </>
    );

  const lots = auction.lots || [];
  const client = typeof auction.client === "object" ? auction.client : null;

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`${getAuctionStatusColor(auction.status)} text-white text-sm px-3 py-1 rounded font-bold uppercase tracking-widest`}
                >
                  {auction.status === "live" ? "LIVE" : auction.status === "scheduled" ? "UPCOMING" : "ENDED"}
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
                  {auction.totalLots} Lots
                </span>
              </div>
            </div>
            <div className="lg:w-80 space-y-6">
              {(auction.status === "live" ||
                auction.status === "scheduled") && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-400 text-sm font-black uppercase tracking-[0.2em] mb-3">
                    {auction.status === "live" ? "Time remaining" : "Starts in"}
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
                  {isWatching ? "In my watchlist" : "Add to watchlist"}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-100 text-gray-500 hover:border-navy hover:text-navy transition-all font-black text-sm uppercase tracking-widest"
                >
                  <Share2 className="h-4 w-4" /> Share
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
                  <ChevronLeft className="h-4 w-4" /> Back to auction
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Images */}
                  <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative mb-3">
                      {selectedLot.images?.[selectedImage]?.url ? (
                        <Image
                          src={
                            selectedLot.images[selectedImage].url.startsWith(
                              "http",
                            )
                              ? selectedLot.images[selectedImage].url
                              : `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedLot.images[selectedImage].url}`
                          }
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
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? "border-burgundy" : "border-gray-100"}`}
                          >
                            <Image
                              src={
                                img.url.startsWith("http")
                                  ? img.url
                                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`
                              }
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
                    <div className="mt-8 border-b border-gray-100 flex gap-8">
                       {['description', 'condition', 'shipping'].map((tab) => (
                          <button
                             key={tab}
                             onClick={() => setActiveTab(tab)}
                             className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-burgundy' : 'text-gray-400 hover:text-navy'}`}
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
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                {selectedLot.dimensions && (
                                   <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-400 font-bold uppercase tracking-wider">Dimensions</span>
                                      <span className="text-navy font-bold">{selectedLot.dimensions}</span>
                                   </div>
                                )}
                                {selectedLot.materials && (
                                   <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-400 font-bold uppercase tracking-wider">Materials</span>
                                      <span className="text-navy font-bold">{selectedLot.materials}</span>
                                   </div>
                                )}
                                {selectedLot.origin && (
                                   <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-400 font-bold uppercase tracking-wider">Origin</span>
                                      <span className="text-navy font-bold">{selectedLot.origin}</span>
                                   </div>
                                )}
                                {selectedLot.yearCreated && (
                                   <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-400 font-bold uppercase tracking-wider">Year</span>
                                      <span className="text-navy font-bold">{selectedLot.yearCreated}</span>
                                   </div>
                                )}
                             </div>
                          </div>
                       )}

                       {activeTab === 'condition' && (
                          <div className="animate-fade-in space-y-4">
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="text-base font-black text-navy uppercase tracking-tight flex items-center gap-2 mb-3">
                                   <Shield className="h-4 w-4 text-burgundy" /> Expert Condition Report
                                </h4>
                                <p className="text-base text-gray-600 leading-relaxed italic">
                                   {selectedLot.conditionReport || "A full condition report is available upon request for this lot. Items are sold 'as is' and should be reviewed in person during public exhibition."}
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
                                <div className="p-4 border border-gray-100 rounded-xl">
                                   <h5 className="text-sm font-black text-navy uppercase tracking-widest mb-1">Domestic Shipping</h5>
                                   <p className="text-sm text-gray-500">Curated delivery within 7-14 business days. Fully insured.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl">
                                   <h5 className="text-sm font-black text-navy uppercase tracking-widest mb-1">Global Logistics</h5>
                                   <p className="text-sm text-gray-500">Worldwide white-glove shipping available via ART-LOG Partners.</p>
                                </div>
                             </div>
                             <p className="text-sm text-gray-400 font-bold uppercase tracking-widest text-center mt-4">Buyer is responsible for all import duties and taxes.</p>
                          </div>
                       )}
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                       <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-black text-navy uppercase tracking-widest">Expert Verified</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <Shield className="h-4 w-4 text-burgundy" />
                          <span className="text-sm font-black text-navy uppercase tracking-widest">Buyer Protected</span>
                       </div>
                    </div>

                    {/* Bid history */}
                    {bidHistory.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-700 mb-2">
                          Bid History ({bidHistory.length})
                        </h4>
                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                          {bidHistory.map((b: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-base py-1.5 border-b border-gray-50"
                            >
                              <span className="text-gray-600">
                                {b.bidderName}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">
                                  {formatCurrency(b.amount)}
                                </span>
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
                <h2 className="section-title mb-10">Auction Lots <span className="text-burgundy">({lots.length})</span></h2>
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
                    No lots available yet
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bid Panel (sticky sidebar) */}
          {selectedLot && (
            <div className="lg:w-96 lg:sticky lg:top-24 lg:self-start">
               {/* Premium Auction House Seals */}
               <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                        <Award className="h-5 w-5 text-gold" />
                     </div>
                     <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Augeo Shield</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-burgundy" />
                     </div>
                     <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Buyer Protection</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-accent" />
                     </div>
                     <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Escrow</span>
                  </div>
               </div>

              <BidPanel
                lot={selectedLot}
                auctionEndTime={auction.endTime}
                auctionStatus={auction.status}
                buyersPremium={auction.buyersPremium}
              />
              
              <div className="mt-8 p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                 <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HistoryIcon className="h-3 w-3 text-gold" /> Bid Increment Strategy
                 </h4>
                 <p className="text-sm text-gray-500 leading-relaxed italic">
                    All bids are subject to a {auction.buyersPremium}% buyer&apos;s premium. Our system follows standard international bid increments to ensure transparency and fairness.
                 </p>
              </div>
            </div>
          )}
        </div>

        {!selectedLot && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-heading font-bold text-dark mb-4">
                About This Auction
              </h3>
              <div
                className="prose prose-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: auction.description }}
              />
              {auction.termsAndConditions && (
                <div className="mt-8">
                  <h4 className="text-xl font-heading font-bold text-dark mb-3">
                    Terms & Conditions
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
                  Auction Details
                </h4>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auction Type</span>
                    <span className="font-medium capitalize">
                      {auction.auctionType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer&apos;s Premium</span>
                    <span className="font-medium">
                      {auction.buyersPremium}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Currency</span>
                    <span className="font-medium">{auction.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Lots</span>
                    <span className="font-medium">{auction.totalLots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Bids</span>
                    <span className="font-medium">{auction.totalBids}</span>
                  </div>
                </div>
                {client && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h5 className="font-medium text-dark mb-2">
                      Auction House
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
