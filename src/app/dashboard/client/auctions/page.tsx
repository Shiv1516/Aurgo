"use client";
import { useState, useEffect } from "react";
import { clientAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import {
  Gavel, Edit2, Eye, Trash2, Plus, Monitor, Activity,
  TrendingUp, Box, Users, ShieldCheck, ChevronRight,
  BarChart3, Clock, Globe, Award
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ClientAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const res = await clientAPI.getAuctions();
      setAuctions(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch auctions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  if (isLoading && auctions.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Maison Catalogues</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage and curate your upcoming global sales.</p>
        </div>

        <Link
          href="/dashboard/client/auctions/create"
          className="bg-burgundy text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-burgundy-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Catalogue
        </Link>
      </div>

      {/* Analytics Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Live Broadcasts', value: auctions.filter(a => a.status === 'live').length, icon: Activity, color: 'text-green-600' },
           { label: 'Total Inventory', value: auctions.reduce((acc, curr) => acc + (curr.totalLots || 0), 0), icon: Box, color: 'text-burgundy' },
           { label: 'Global Interest', value: auctions.reduce((acc, curr) => acc + (curr.totalBids || 0), 0), icon: TrendingUp, color: 'text-navy' },
           { label: 'Platform Status', value: 'Prime', icon: ShieldCheck, color: 'text-gray-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className={`p-3 rounded bg-gray-50 ${stat.color}`}>
                 <stat.icon className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-bold text-navy">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Portfolio Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group flex flex-col hover:shadow-md hover:border-burgundy transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={auction.coverImage.startsWith('http') ? auction.coverImage : `${process.env.NEXT_PUBLIC_BACKEND_URL}${auction.coverImage}`}
                  alt={auction.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`text-sm font-bold uppercase px-3 py-1 rounded shadow-sm ${
                    auction.status === 'live' ? 'bg-green-500 text-white' :
                    auction.status === 'scheduled' ? 'bg-white text-navy' :
                    'bg-white/90 text-navy'
                  }`}>
                    {auction.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                   <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Collection</p>
                   <h3 className="text-lg font-bold text-navy leading-tight line-clamp-2 uppercase">{auction.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100">
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Asset Count</p>
                    <div className="flex items-center gap-1.5">
                       <Box className="h-3.5 w-3.5 text-gray-400" />
                       <p className="text-sm font-bold text-navy">{auction.totalLots} Lots</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Engagement</p>
                    <div className="flex items-center gap-1.5">
                       <TrendingUp className="h-3.5 w-3.5 text-burgundy" />
                       <p className="text-sm font-bold text-navy">{auction.totalBids || 0} Bids</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <Link
                    href={`/dashboard/client/auctions/${auction._id}/edit`}
                    className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-navy hover:bg-gray-100 hover:border-gray-300 rounded text-center transition-all font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Curate
                  </Link>
                  <Link
                    href={`/auctions/${auction.slug}`}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:text-navy hover:bg-gray-50 rounded transition-all flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

        {auctions.length === 0 && (
          <div className="lg:col-span-3 py-24 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-navy uppercase tracking-tight mb-1">Portfolio Empty</h3>
            <p className="text-sm text-gray-500 font-medium">Your boutique portfolio is currently empty. Start drafting your first catalogue.</p>
            <Link href="/dashboard/client/auctions/create" className="mt-6 text-burgundy font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
               Initialize First Collection <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
