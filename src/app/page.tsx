"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
  Award,
  Users,
  TrendingUp,
  Package,
} from "lucide-react";

export default function HomePage() {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [latestAuctions, setLatestAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, liveRes, upcomingRes, latestRes, catRes] =
          await Promise.allSettled([
            auctionAPI.getFeatured(),
            auctionAPI.getAll({ status: "live", limit: 6 }),
            auctionAPI.getAll({
              status: "scheduled",
              limit: 6,
              sort: "startTime",
            }),
            auctionAPI.getAll({
              sort: "-createdAt",
              limit: 3,
            }),
            categoryAPI.getAll(),
          ]);

        if (featuredRes.status === "fulfilled" && featuredRes.value.data.data?.length > 0)
          setFeaturedAuctions(featuredRes.value.data.data);
        else setFeaturedAuctions([]);

        if (liveRes.status === "fulfilled" && liveRes.value.data.data?.length > 0)
          setLiveAuctions(liveRes.value.data.data);
        else setLiveAuctions([]);

        if (upcomingRes.status === "fulfilled" && upcomingRes.value.data.data?.length > 0)
          setUpcomingAuctions(upcomingRes.value.data.data);
        else setUpcomingAuctions([]);

        if (latestRes.status === "fulfilled" && latestRes.value.data.data?.length > 0)
          setLatestAuctions(latestRes.value.data.data);
        else setLatestAuctions([]);

        if (catRes.status === "fulfilled" && catRes.value.data.data?.length > 0)
          setCategories(catRes.value.data.data);
        else setCategories([]);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );

  return (
    <>
      {/* Hero Section - Refined Design */}
      <section className="relative bg-[#0a0a0b] min-h-[85vh] flex items-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-gold/10 to-transparent skew-x-12 transform translate-x-1/4" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-8">
                <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                  The Global Standard for Excellence
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-heading font-extrabold text-white leading-[1.1] mb-8">
                Experience <br />
                <span className="text-gold-gradient italic">Curated</span> <br />
                Luxury
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-lg">
                The world&apos;s most prestigious destination for rare collectibles, fine art, and high-end jewelry. Bid with confidence, anywhere in the world.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/auctions"
                  className="px-10 py-4 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center gap-3 group"
                >
                  Start Bidding <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pages/how-it-works"
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 backdrop-blur-sm"
                >
                  View Guide
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative z-10 p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Current Active Auctions</div>
                       <div className="text-white text-3xl font-bold">{liveAuctions.length} <span className="text-gold text-lg font-normal">Live Now</span></div>
                    </div>
                    <div className="p-3 rounded-2xl bg-gold/10">
                       <Gavel className="h-8 w-8 text-gold" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {liveAuctions.slice(0, 2).map((a, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="h-16 w-16 rounded-xl bg-gray-800 overflow-hidden relative">
                           {a.coverImage && <Image src={a.coverImage.startsWith('http') ? a.coverImage : `${process.env.NEXT_PUBLIC_BACKEND_URL}${a.coverImage}`} alt="" fill className="object-cover" />}
                        </div>
                        <div className="flex-grow">
                           <div className="text-white font-bold text-sm truncate max-w-[150px]">{a.title}</div>
                           <div className="text-gold text-xs font-medium uppercase tracking-tighter">Closing Soon</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border border-gold/20 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-gold/20 rounded-2xl rotate-12 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats - Executive Banner */}
      <section className="bg-[#0a0a0b] border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Active Bidders", value: "42k+", icon: Users },
              { label: "Items Listed", value: "1,200+", icon: Package },
              { label: "Total Volume", value: "$842M", icon: TrendingUp },
              { label: "World Records", value: "156", icon: Award },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start group">
                <div className="flex items-center gap-3 mb-1">
                  <stat.icon className="h-4 w-4 text-gold/50 group-hover:text-gold transition-colors" />
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                    {stat.value}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Spotlight - Granular Product Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
               <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-red-600 mb-4">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Pulse</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tighter mb-4 uppercase">
                    Live <span className="text-gold italic">Spotlight</span>
                  </h2>
                  <p className="text-gray-500 text-lg font-medium leading-relaxed">
                    Granular entry points into world-class collections currently under the hammer.
                  </p>
               </div>
               <Link href="/auctions" className="group flex items-center gap-3 text-dark font-black text-xs uppercase tracking-[0.2em] hover:text-gold transition-all">
                  View All Live <div className="p-2 bg-dark group-hover:bg-gold rounded-full transition-all"><ChevronRight className="h-4 w-4 text-white" /></div>
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {liveAuctions.slice(0, 3).map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
               ))}
               {liveAuctions.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
                     <Gavel className="h-12 w-12 mb-4 opacity-20" />
                     <p className="text-sm font-bold uppercase tracking-widest">No Live Spotlights at this moment</p>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* Fresh to Market - Grid Layout */}
      <section className="py-24 bg-[#fafafa] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-2">
                Recently <span className="text-gold italic">Annexed</span>
              </h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">The latest arrivals in our vault</p>
            </div>
            <Link href="/auctions" className="btn-outline !py-2.5 !px-6 text-[10px] uppercase tracking-widest font-black">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestAuctions.length > 0 ? (
              latestAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))
            ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
                    <Package className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">New arrivals coming soon</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Immersive Categories - High Impact Visuals */}
      <section className="py-32 bg-[#0a0a0b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full translate-x-1/2 animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="text-gold text-xs font-black uppercase tracking-[0.5em] mb-4 block">Classification</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase leading-none">
              Curated <span className="text-gold italic">Collections</span>
            </h2>
            <div className="h-1 w-24 bg-gold mx-auto rounded-full mb-8" />
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto italic">
              Explore meticulously authenticated assets across the world&apos;s most prestigious investment classes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, i) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-dark-light border border-white/5 hover:border-gold/30 transition-all duration-700"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10" />
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
                
                <div className="absolute inset-0 w-full h-full p-10 flex flex-col justify-end z-30">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    Guild Tier {i + 1}
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-gold transition-colors duration-500">
                    {category.name}
                  </h3>
                  <div className="mt-6 h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-700" />
                </div>
                
                <div className="absolute top-10 right-10 text-white/5 group-hover:text-gold/20 transition-colors duration-700">
                   <Star className="h-16 w-16" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      {featuredAuctions.length > 0 && (
        <section className="py-32 bg-white relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                 <div>
                    <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-2">
                      Platinum <span className="text-gold italic">Choice</span>
                    </h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">Curated by our expert council</p>
                 </div>
                 <Link href="/auctions?featured=true" className="group flex items-center gap-3 text-dark font-black text-xs uppercase tracking-[0.2em] hover:text-gold transition-all">
                    See All Classics <div className="p-2 bg-dark group-hover:bg-gold rounded-full transition-all"><ChevronRight className="h-4 w-4 text-white" /></div>
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {featuredAuctions.slice(0, 3).map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} />
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Upcoming Auctions */}
      {upcomingAuctions.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-gold-dark text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4" /> Calendar Preview
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-dark italic">Future <span className="text-gold not-italic">Engagements</span></h2>
              </div>
              <Link
                href="/auctions?status=scheduled"
                className="group flex items-center gap-2 text-gold font-bold hover:text-gold-dark transition-colors"
              >
                Full Calendar <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingAuctions.slice(0, 3).map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section - Professional Update */}
      <section className="py-32 bg-gray-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gold/5 -skew-x-12" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.5em] mb-4 block">Our Ethos</span>
            <h2 className="text-5xl font-heading font-bold text-dark mb-4">
              Unrivaled <span className="text-gold italic">Commitment</span>
            </h2>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Shield, 
                title: "Certified Integrity", 
                desc: "Rigorous multi-stage verification for every listing, ensuring provenance and absolute peace of mind." 
              },
              { 
                icon: Globe, 
                title: "Borderless Access", 
                desc: "Our platform connects global connoisseurs with the world's most exclusive liquid assets in real-time." 
              },
              { 
                icon: Award, 
                title: "Secure Settlement", 
                desc: "High-tier encryption and institutional-grade financial processing powered by Stripe Capital." 
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group p-10 bg-white rounded-3xl border border-gray-100 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all">
                  <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-dark mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed italic">
                    &quot;{item.desc}&quot;
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Executive Style */}
      <section className="py-32 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-[120px]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-white mb-8 leading-tight">
            Elevate Your <br /><span className="text-gold italic">Legacy</span> Today
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed italic font-heading">
            Join an elite network of global collectors and institutions. Authenticate, bid, and acquire world-class assets in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/auth/register"
              className="px-12 py-5 bg-gold hover:bg-gold-dark text-dark font-black rounded-[1.5rem] transition-all shadow-xl shadow-gold/10 text-lg tracking-wider"
            >
              JOIN THE GUILD
            </Link>
            <Link
              href="/auctions"
              className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-[1.5rem] transition-all border border-white/20 backdrop-blur-md text-lg"
            >
              Explore Assets
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
