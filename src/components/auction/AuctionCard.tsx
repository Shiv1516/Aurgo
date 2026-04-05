"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction } from "@/types";
import { formatCurrency, formatDate, getAuctionStatusColor, getAssetUrl } from "@/lib/utils";
import { watchlistAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import CountdownTimer from "@/components/common/CountdownTimer";
import { Calendar, MapPin, Layers, Eye, Gavel, ChevronRight, Package, Clock, Heart } from "lucide-react";

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistId, setWatchlistId] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      watchlistAPI.check(auction._id).then(res => {
        if (res.data.isWatched) {
          setIsWatched(true);
          setWatchlistId(res.data.watchlistId);
        }
      }).catch(() => {});
    }
  }, [auction._id, isAuthenticated]);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to manage your watchlist");
      return;
    }

    setIsWatching(true);
    try {
      if (isWatched && watchlistId) {
        await watchlistAPI.remove(watchlistId);
        setIsWatched(false);
        setWatchlistId(null);
        toast.success("Removed from watchlist");
      } else {
        const res = await watchlistAPI.add({ auctionId: auction._id });
        setIsWatched(true);
        setWatchlistId(res.data.data._id);
        toast.success("Added to watchlist");
      }
    } catch (error) {
      console.error("Watchlist toggle failed", error);
    } finally {
      setIsWatching(false);
    }
  };

  const isLive = auction.status === "live";
  const isScheduled = auction.status === "scheduled";
  const isHot = (auction.totalBids || 0) > 10 || (auction.viewCount || 0) > 50;

  return (
    <Link href={`/auctions/${auction.slug}`}>
      <div className="card group min-h-[450px] flex flex-col">
        {/* Main Cover Image */}
        <div className="relative aspect-[4/3] w-full bg-navy overflow-hidden shrink-0">
          {auction.coverImage ? (
            <Image
              src={getAssetUrl(auction.coverImage)}
              alt={auction.title || "Auction"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="h-12 w-12 text-white" />
            </div>
          )}
          
          {/* Status Badge overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <span className={`badge ${isLive ? 'badge-live' : isScheduled ? 'badge-scheduled' : 'badge-ended'}`}>
              {isLive ? "Live Sale" : isScheduled ? "Upcoming" : "Closed"}
            </span>
          </div>

          {/* Watchlist Toggle */}
          <button
            onClick={toggleWatchlist}
            disabled={isWatching}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group/heart hover:bg-white transition-all duration-500"
          >
            <Heart 
               className={`h-5 w-5 transition-all duration-500 ${isWatched ? 'fill-burgundy text-burgundy scale-125' : 'text-white group-hover/heart:text-burgundy group-hover/heart:scale-110'}`} 
            />
          </button>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
             <span className="text-sm font-black text-white uppercase tracking-[0.1em] flex items-center gap-2">
                Explore Catalogue <ChevronRight className="h-3 w-3 text-gold" />
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow bg-white">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-sm font-black text-gold uppercase tracking-[0.1em]">Lot Selection</span>
             <span className="h-px flex-grow bg-gray-100" />
          </div>
          
          <h3 className="text-navy font-black text-2xl leading-tight mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-gold transition-colors uppercase tracking-tighter">
            {auction.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-200">
             <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center gap-1.5 text-navy font-black text-sm uppercase tracking-tighter">
                   <MapPin className="h-3 w-3 text-gold" />
                   {auction.location?.city || 'Digital'}
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Time Left</p>
                <div className="flex items-center gap-1.5 text-burgundy font-black text-sm uppercase tracking-tighter">
                   <Clock className="h-3 w-3" />
                   <CountdownTimer endTime={isLive ? auction.endTime : auction.startTime} variant="compact" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
