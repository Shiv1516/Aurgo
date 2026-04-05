"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuctionCard from "@/components/auction/AuctionCard";
import AuctionCardSkeleton from "@/components/auction/AuctionCardSkeleton";
import { CategorySliderSkeleton } from "@/components/common/Skeletons";
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
  Car,
  Palette,
  Sofa,
  Gem,
  Watch,
  Home,
  Laptop,
  Shirt,
  Music,
  Coins,
  ChevronRight,
  ChevronLeft,
  Wine,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "@/lib/utils";

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto") || lower.includes("motor")) return <Car className="h-12 w-12" />;
  if (lower.includes("art") || lower.includes("paint") || lower.includes("sculpture")) return <Palette className="h-12 w-12" />;
  if (lower.includes("furniture") || lower.includes("home") || lower.includes("antique")) return <Sofa className="h-12 w-12" />;
  if (lower.includes("jewel") || lower.includes("ring") || lower.includes("diamond")) return <Gem className="h-12 w-12" />;
  if (lower.includes("watch") || lower.includes("time") || lower.includes("clock") || lower.includes("orology")) return <Watch className="h-12 w-12" />;
  if (lower.includes("estate") || lower.includes("property")) return <Home className="h-12 w-12" />;
  if (lower.includes("tech") || lower.includes("electron") || lower.includes("computer")) return <Laptop className="h-12 w-12" />;
  if (lower.includes("fashion") || lower.includes("cloth") || lower.includes("bag")) return <Shirt className="h-12 w-12" />;
  if (lower.includes("music") || lower.includes("instrument")) return <Music className="h-12 w-12" />;
  if (lower.includes("coin") || lower.includes("stamp") || lower.includes("numismatic")) return <Coins className="h-12 w-12" />;
  if (lower.includes("spirit") || lower.includes("wine") || lower.includes("alcohol") || lower.includes("bottle")) return <Wine className="h-12 w-12" />;
  if (lower.includes("book") || lower.includes("manuscript") || lower.includes("library")) return <BookOpen className="h-12 w-12" />;
  return <Star className="h-12 w-12" />;
};

const DUMMY_CATEGORIES = [
  { _id: "d1", name: "Rare Orology", slug: "rare-orology" },
  { _id: "d2", name: "Estate Jewelry", slug: "estate-jewelry" },
  { _id: "d3", name: "Classic Motors", slug: "classic-motors" },
  { _id: "d4", name: "Antique Furniture", slug: "antique-furniture" },
  { _id: "d5", name: "Fine Spirits", slug: "fine-spirits" },
  { _id: "d6", name: "Numismatics", slug: "numismatics" },
  { _id: "d7", name: "Rare Books", slug: "rare-books" },
];

const DUMMY_LIVE_AUCTIONS = [
  {
    _id: "l1",
    title: "1962 Ferrari 250 GTO Heritage Special Edition",
    slug: "1962-ferrari-250-gto",
    coverImage: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000",
    currentBid: 48000000,
    startTime: new Date().toISOString(),
    status: "live",
    client: { companyName: "Maranello Archives" }
  },
  {
    _id: "l2",
    title: "The 'Eternal Promise' 50ct Pink Diamond Pendant",
    slug: "eternal-promise-diamond",
    coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000",
    currentBid: 12500000,
    startTime: new Date().toISOString(),
    status: "live",
    client: { companyName: "Antwerp Diamond Bourse" }
  },
  {
    _id: "l3",
    title: "Rolex Daytona 'Paul Newman' Ref. 6239 Pristine",
    slug: "rolex-daytona-paul-newman",
    coverImage: "/rolex_daytona.png",
    currentBid: 1780000,
    startTime: new Date().toISOString(),
    status: "live",
    client: { companyName: "Geneva Watch Group" }
  }
];

const DUMMY_UPCOMING_AUCTIONS = [
  {
    _id: "u1",
    title: "First Edition: Newton's Mathematical Principles",
    slug: "newton-principia-first-edition",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000",
    startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: "scheduled",
    client: { companyName: "Royal Society Archives" }
  },
  {
    _id: "u2",
    title: "Imperial Ming Dynasty 'Dragon' Celadon Vase",
    slug: "ming-dynasty-vase",
    coverImage: "/ming_vase.png",
    startTime: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: "scheduled",
    client: { companyName: "Forbidden City Collections" }
  },
  {
    _id: "u3",
    title: "Château Mouton Rothschild 1945 Imperial",
    slug: "mouton-rothschild-1945",
    coverImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1000",
    startTime: new Date(Date.now() + 86400000 * 10).toISOString(),
    status: "scheduled",
    client: { companyName: "Bordeaux Heritage" }
  },
  {
    _id: "u4",
    title: "Original Patek Philippe Ref. 1518 Perpetual",
    slug: "patek-philippe-1518",
    coverImage: "/patek_philippe.png",
    startTime: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: "scheduled",
    client: { companyName: "Patrimony Suisse" }
  }
];

export default function HomePage() {
  const router = useRouter();
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  
  const displayCategories = categories.length > 0 ? categories : DUMMY_CATEGORIES;
  const displayLiveAuctions = liveAuctions.length > 0 ? liveAuctions : DUMMY_LIVE_AUCTIONS;
  const displayUpcomingAuctions = upcomingAuctions.length > 0 ? upcomingAuctions : DUMMY_UPCOMING_AUCTIONS;

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

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (displayCategories.length > 0 && sliderRef.current && !isHovered) {
      interval = setInterval(() => {
        if (sliderRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            sliderRef.current.scrollBy({ left: 252, behavior: 'smooth' });
          }
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [displayCategories, isHovered]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const heroImageUrl = "/auction_hero_bg.png";

  return (
    <main className="bg-[#f5f5f5] min-h-screen">
      <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-navy">
        <Image 
          src={heroImageUrl} 
          alt="Premium Auction Background" 
          fill 
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-black/30" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-tight">
            Discover Exceptional <br className="hidden md:block" />
            <span className="text-burgundy">Art & Assets</span>
          </h1>
          <form 
            onSubmit={handleSearch} 
            className="bg-white rounded-lg shadow-2xl flex flex-col md:flex-row max-w-4xl mx-auto overflow-hidden focus-within:ring-4 focus-within:ring-burgundy/30 transition-shadow"
          >
            <div className="flex-grow flex items-center pl-6 pr-2 py-4 bg-white">
              <Search className="h-6 w-6 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search for a lot, an artist, or a category..." 
                className="w-full pl-4 pr-4 py-2 bg-transparent border-none text-gray-800 font-medium placeholder:text-gray-400 focus:ring-0 outline-none text-base md:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-burgundy hover:bg-[#80101c] text-white px-10 py-4 font-bold transition-colors text-center uppercase text-sm md:text-base tracking-wider flex-shrink-0"
            >
              Search
            </button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white font-medium text-sm md:text-base drop-shadow">
             {['Vehicles', 'Art', 'Furniture', 'Jewelry', 'Watches', 'Real Estate'].map((tag) => (
               <Link key={tag} href={`/search?q=${tag}`} className="hover:text-burgundy-light transition-colors">
                  {tag}
               </Link>
             ))}
          </div>
        </div>
      </section>
      <section className="bg-white border-b border-gray-200 py-20 shadow-sm relative z-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div className="max-w-2xl">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-burgundy text-sm font-black uppercase tracking-normal mb-4"
                  >
                    <div className="h-px w-8 bg-burgundy/30" />
                    Curated Selections
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-navy tracking-tighter uppercase leading-none mb-4"
                  >
                    Premium <span className="text-burgundy italic">Collections</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 font-medium text-lg italic"
                  >
                    Explore our globally sourced archives across ten specialized heritage departments.
                  </motion.p>
               </div>
               
               <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (sliderRef.current) {
                        sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                      }
                    }}
                    className="p-4 rounded-full border border-gray-200 bg-white hover:border-burgundy hover:text-burgundy transition-all shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (sliderRef.current) {
                        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                      }
                    }}
                    className="p-4 rounded-full border border-gray-200 bg-white hover:border-burgundy hover:text-burgundy transition-all shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
               </div>
            </div>

            <div 
               ref={sliderRef}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
               className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory hide-scrollbar relative" 
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
               <style dangerouslySetInnerHTML={{__html: `
                 .hide-scrollbar::-webkit-scrollbar { display: none; }
               `}} />
               
               {isLoading ? (
                   <CategorySliderSkeleton />
                ) : displayCategories.length > 0 ? displayCategories.map((cat, i) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="snap-start shrink-0"
                  >
                    <Link href={`/categories/${cat.slug}`} className="flex flex-col items-center gap-6 p-10 bg-white border border-gray-200 hover:border-burgundy/30 hover:shadow-2xl hover:shadow-burgundy/5 transition-all rounded-[12px] w-[220px] group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-8 w-8 text-burgundy" />
                       </div>
                       
                       <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-dark group-hover:text-burgundy transition-all duration-500 relative z-10 shadow-inner">
                          <div className="absolute inset-0 bg-burgundy/5 rounded-full scale-0 group-hover:scale-125 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.8, ease: "anticipate" }}
                          >
                             {getCategoryIcon(cat.name)}
                          </motion.div>
                       </div>
                       
                       <div className="text-center">
                          <span className="block text-sm font-black text-burgundy uppercase tracking-[0.1em] mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Portfolio</span>
                          <span className="text-base font-black text-navy uppercase tracking-widest group-hover:text-burgundy transition-colors whitespace-nowrap">{cat.name}</span>
                       </div>
                    </Link>
                  </motion.div>
                )) : (
                  <div className="py-20 text-center text-gray-400 w-full font-bold uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-3xl">Initializing Archives...</div>
                )}
            </div>
         </div>
      </section>
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
                {isLoading ? (
                   Array.from({ length: 6 }).map((_, i) => (
                      <AuctionCardSkeleton key={i} />
                   ))
                ) : displayLiveAuctions.length > 0 ? (
                  displayLiveAuctions.slice(0, 6).map((auction: any) => (
                    <AuctionCard key={auction._id} auction={auction} />
                  ))
                ) : (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border border-gray-200 shadow-sm rounded-2xl">
                     <Clock className="h-10 w-10 text-gray-300 mb-3" />
                     <p className="font-semibold text-gray-500 uppercase tracking-widest text-sm">No live auctions currently broadcasting.</p>
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
                {isLoading ? (
                   Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full">
                         <div className="relative aspect-[4/3] w-full bg-gray-50">
                            <div className="absolute inset-0 bg-[linear-gradient(110deg,#f3f4f6,45%,#e5e7eb,55%,#f3f4f6)] bg-[length:200%_100%] animate-shimmer" />
                         </div>
                         <div className="p-4 space-y-3">
                            <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse" />
                         </div>
                      </div>
                   ))
                ) : displayUpcomingAuctions.length > 0 ? (
                  displayUpcomingAuctions.map((auction: any) => (
                    <Link key={auction._id} href={`/auctions/${auction.slug}`} className="group bg-white border border-gray-200 hover:border-burgundy hover:shadow-md transition-all rounded-xl overflow-hidden flex flex-col">
                      <div className="relative aspect-[4/3] w-full bg-gray-100">
                        <Image 
                          src={getAssetUrl(auction.coverImage)} 
                          alt={auction.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 text-sm font-black uppercase shadow-sm rounded">
                          {new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-navy text-sm mb-2 group-hover:text-burgundy transition-colors line-clamp-2 uppercase tracking-tight">
                          {auction.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-black uppercase tracking-widest mt-auto flex items-center gap-1.5 truncate">
                          <Gavel className="h-3 w-3" />
                          {(typeof auction.client === 'object' && auction.client ? auction.client.companyName : null) || "Augeo Vault"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-400 border border-gray-200 rounded-2xl font-bold uppercase tracking-widest">
                     No upcoming catalog entries.
                  </div>
                )}
             </div>
         </div>
      </section>
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
