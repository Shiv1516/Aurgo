"use client";

import Link from "next/link";
import Image from "next/image";
import { Auction } from "@/types";
import { formatCurrency, formatDate, getAuctionStatusColor } from "@/lib/utils";
import CountdownTimer from "@/components/common/CountdownTimer";
import { Calendar, MapPin, Layers, Eye, Gavel, ChevronRight } from "lucide-react";

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const isLive = auction.status === "live";
  const isScheduled = auction.status === "scheduled";
  const isHot = (auction.totalBids || 0) > 10 || (auction.viewCount || 0) > 50;

  return (
    <Link href={`/auctions/${auction.slug}`}>
      <div className="card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none bg-white overflow-hidden rounded-2xl">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {auction.coverImage ? (
            <Image
              src={
                auction.coverImage.startsWith("http")
                  ? auction.coverImage
                  : `https://aurgo-backend-1.onrender.com${auction.coverImage}`
              }
              alt={auction.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
              <span className="text-gold text-4xl font-heading font-bold opacity-20">
                Augeo
              </span>
            </div>
          )}

          {/* Badges - Glassmorphism style */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`${getAuctionStatusColor(auction.status)} backdrop-blur-md bg-opacity-80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm`}
            >
              {isLive ? "● Live" : auction.status}
            </span>
            {isHot && (
              <span className="bg-red-500 backdrop-blur-md bg-opacity-80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm animate-pulse">
                🔥 Hot
              </span>
            )}
          </div>

          {auction.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-gold backdrop-blur-md bg-opacity-90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                Star Pick
              </span>
            </div>
          )}

          {/* Countdown overlay for live auctions */}
          {isLive && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/90 to-transparent p-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <CountdownTimer endTime={auction.endTime} variant="compact" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="font-heading font-bold text-xl text-dark group-hover:text-gold transition-colors line-clamp-1 mb-2">
              {auction.title}
            </h3>

            {auction.shortDescription && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                {auction.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold/70" />
                <span className="font-medium">
                  {isScheduled
                    ? `Starts ${formatDate(auction.startTime)}`
                    : formatDate(auction.startTime)}
                </span>
              </div>
              {auction.location?.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold/70" />
                  <span className="font-medium">{auction.location.city}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-dark font-bold">
                <Layers className="h-4 w-4 text-gold" />
                <span>{auction.totalLots} <span className="text-gray-400 font-medium">Lots</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-bold">
                <Gavel className="h-4 w-4 text-gold/70" />
                <span>{auction.totalBids || 0} <span className="text-gray-400 font-medium font-normal">Bids</span></span>
              </div>
            </div>
            
            <div className="text-gold font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              {isLive ? "Bid Now" : "Details"} <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
