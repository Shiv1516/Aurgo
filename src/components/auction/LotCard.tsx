"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Lot, Auction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { watchlistAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Gavel, Eye, Heart } from "lucide-react";

interface LotCardProps {
  lot: Lot;
  auctionSlug: string;
}

export default function LotCard({ lot, auctionSlug }: LotCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistId, setWatchlistId] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      watchlistAPI.check(lot._id).then(res => {
        if (res.data.isWatched) {
          setIsWatched(true);
          setWatchlistId(res.data.watchlistId);
        }
      }).catch(() => {});
    }
  }, [lot._id, isAuthenticated]);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add to watchlist");
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
        const res = await watchlistAPI.add({ lotId: lot._id });
        setIsWatched(true);
        setWatchlistId(res.data.data._id);
        toast.success("Added to watchlist");
      }
    } catch (error) {
      toast.error("Failed to update watchlist");
    } finally {
      setIsWatching(false);
    }
  };

  const mainImage = lot.images?.[0]?.url;

  return (
    <Link href={`/auctions/${auctionSlug}?lot=${lot._id}`}>
      <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={
                mainImage.startsWith("http")
                  ? mainImage
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}${mainImage}`
              }
              alt={lot.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Gavel className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="absolute top-2 left-2 bg-dark/80 text-white text-sm px-2 py-0.5 rounded font-black uppercase tracking-widest">
            Lot {lot.lotNumber}
          </div>

          <button
            onClick={toggleWatchlist}
            disabled={isWatching}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group/heart hover:bg-white transition-all"
          >
            <Heart 
               className={`h-4 w-4 transition-all ${isWatched ? 'fill-burgundy text-burgundy' : 'text-white group-hover/heart:text-burgundy'}`} 
            />
          </button>

          {lot.status === "sold" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-base font-bold px-4 py-1.5 rounded -rotate-12">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-bold text-base text-navy group-hover:text-burgundy transition-colors line-clamp-2 mb-1">
            {lot.title}
          </h4>

          {lot.artist && (
            <p className="text-sm text-gray-500 mb-2">{lot.artist}</p>
          )}

          {lot.estimateLow && lot.estimateHigh && (
            <p className="text-sm text-gray-500 mb-1">
              Est. {formatCurrency(lot.estimateLow)} -{" "}
              {formatCurrency(lot.estimateHigh)}
            </p>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500 uppercase">
                {lot.currentBid > 0 ? "Current Bid" : "Starting Bid"}
              </p>
              <p className="text-base font-bold text-dark">
                {formatCurrency(
                  lot.currentBid > 0 ? lot.currentBid : lot.startingBid,
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Gavel className="h-3 w-3" />
              <span>{lot.totalBids} bids</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
