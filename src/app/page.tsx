"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuctionCard from "@/components/auction/AuctionCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { auctionAPI, categoryAPI } from "@/lib/api";
import { Auction, Category } from "@/types";
import {
  Gavel,
  Shield,
  Globe,
  Clock,
  ArrowRight,
  Star,
  Award,
  Search,
  Calendar,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, liveRes, upcomingRes, catRes] =
          await Promise.allSettled([
            auctionAPI.getFeatured(),
            auctionAPI.getAll({ status: "live", limit: 6 }),
            auctionAPI.getAll({ status: "scheduled", limit: 8, sort: "startTime" }),
            categoryAPI.getAll(),
          ]);

        if (featuredRes.status === "fulfilled" && featuredRes.value.data.data?.length > 0)
          setFeaturedAuctions(featuredRes.value.data.data);

        if (liveRes.status === "fulfilled" && liveRes.value.data.data?.length > 0)
          setLiveAuctions(liveRes.value.data.data);

        if (upcomingRes.status === "fulfilled" && upcomingRes.value.data.data?.length > 0)
          setUpcomingAuctions(upcomingRes.value.data.data);

        if (catRes.status === "fulfilled" && catRes.value.data.data?.length > 0)
          setCategories(catRes.value.data.data);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) return <PageLoader />;

  // Background image resolution logic
  const heroImageUrl = featuredAuctions.length > 0 && featuredAuctions[0].coverImage 
    ? (featuredAuctions[0].coverImage.startsWith('http') ? featuredAuctions[0].coverImage : `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${featuredAuctions[0].coverImage}`)
    : null;

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      
      {/* 1. Hero Section - Interencheres Style */}
      <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-navy">
        {heroImageUrl ? (
          <>
            <Image 
              src={heroImageUrl} 
              alt="Interencheres Auctions Background" 
              fill 
              priority
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#2d3748]" />
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Find your next acquisition among 100,000 lots
          </h1>

          {/* Central Search Form */}
          <form 
            onSubmit={handleSearch} 
            className="bg-white rounded shadow-lg flex flex-col md:flex-row max-w-3xl mx-auto overflow-hidden focus-within:ring-2 focus-within:ring-burgundy transition-shadow"
          >
            <div className="flex-grow flex items-center pl-4 pr-2 py-3 bg-white">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search for a lot, an artist, or a category..." 
                className="w-full pl-3 pr-4 py-2 bg-transparent border-none text-gray-800 font-medium placeholder:text-gray-400 focus:ring-0 outline-none text-base md:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-burgundy hover:bg-[#a01523] text-white px-8 py-4 font-bold transition-colors text-center uppercase text-sm md:text-base tracking-wide flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Links underneath */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-white font-medium text-sm md:text-base drop-shadow-md">
             {['Vehicles', 'Art', 'Furniture', 'Jewelry', 'Watches', 'Real Estate'].map((tag) => (
               <Link key={tag} href={`/search?q=${tag}`} className="hover:underline hover:text-gray-200 transition-colors">
                  {tag}
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 2. Top Categories Quick Grid */}
      <section className="bg-white border-b border-gray-200 py-8 shadow-sm relative z-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
               {categories.slice(0, 8).map((cat) => (
                 <Link key={cat._id} href={`/categories/${cat.slug}`} className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 transition-colors rounded">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-burgundy group-hover:text-white transition-colors">
                       <Star className="h-6 w-6" />
                    </div>
                    <span className="text-sm md:text-sm font-semibold text-gray-800 text-center">{cat.name}</span>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Live Auctions Section */}
      <section className="py-12 bg-[#f5f5f5]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-l-4 border-burgundy pl-4">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
                 Live Sales
               </h2>
               <Link href="/auctions?status=live" className="text-sm font-bold text-burgundy hover:text-red-800 transition-colors uppercase flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {liveAuctions.length > 0 ? (
                 liveAuctions.slice(0, 6).map((auction) => (
                   <AuctionCard key={auction._id} auction={auction} />
                 ))
               ) : (
                 <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border border-gray-200 shadow-sm rounded">
                    <Clock className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="font-semibold text-gray-500">No live auctions currently broadcasting.</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* 4. Upcoming Auctions Section */}
      <section className="py-12 bg-white border-t border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-l-4 border-gray-400 pl-4">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
                 Upcoming Auctions
               </h2>
               <Link href="/auctions?status=scheduled" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase flex items-center gap-1">
                  Calendar <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {upcomingAuctions.length > 0 ? (
                 upcomingAuctions.map((auction) => (
                   <Link key={auction._id} href={`/auctions/${auction.slug}`} className="group bg-white border border-gray-200 hover:border-burgundy hover:shadow-md transition-all rounded overflow-hidden flex flex-col">
                     <div className="relative aspect-[4/3] w-full bg-gray-100">
                       <Image 
                         src={auction.coverImage?.startsWith('http') ? auction.coverImage : `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${auction.coverImage || ''}`} 
                         alt={auction.title}
                         fill
                         className="object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                       <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 text-sm font-bold uppercase shadow">
                         {new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </div>
                     </div>
                     <div className="p-4 flex flex-col flex-grow">
                       <h3 className="font-bold text-gray-900 text-sm md:text-base mb-2 group-hover:text-burgundy transition-colors line-clamp-2">
                         {auction.title}
                       </h3>
                       <p className="text-gray-500 text-sm mt-auto flex items-center gap-1.5 truncate">
                         <Gavel className="h-3.5 w-3.5" />
                         {(typeof auction.client === 'object' && auction.client ? auction.client.companyName : null) || "Augeo Auction House"}
                       </p>
                     </div>
                   </Link>
                 ))
               ) : (
                 <div className="col-span-full py-16 text-center text-gray-500 border border-gray-200 rounded">
                    <p className="font-semibold">No upcoming catalog entries.</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* 5. Trust & Information Footer */}
      <section className="py-16 bg-[#f5f5f5]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Why use our platform?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
               <div className="bg-white p-8 rounded border border-gray-200 shadow-sm">
                  <Shield className="h-10 w-10 text-burgundy mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Authenticity</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">All objects presented are appraised and guaranteed by professional auctioneers and experts.</p>
               </div>
               <div className="bg-white p-8 rounded border border-gray-200 shadow-sm">
                  <Globe className="h-10 w-10 text-burgundy mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Live Bidding Engine</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Bid in real-time online during the auction broadcast, exactly as if you were in the room.</p>
               </div>
               <div className="bg-white p-8 rounded border border-gray-200 shadow-sm">
                  <Award className="h-10 w-10 text-burgundy mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Transactions</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Your data and payments are secured via bank-grade encryption protocols.</p>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
