"use client";
import { useState, useEffect } from "react";
import { clientAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Gavel, Edit2, Eye, Trash2, Plus, Monitor } from "lucide-react";
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">My Boutique</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Portfolio Management & Curation</p>
        </div>
        <Link 
          href="/dashboard/client/auctions/create" 
          className="bg-dark text-gold px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gold/10 hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          <Plus className="h-4 w-4" /> New Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctions.map((auction) => (
          <div key={auction._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.03] border border-white group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={auction.coverImage} 
                alt={auction.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest ${
                  auction.status === 'live' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 
                  auction.status === 'scheduled' ? 'bg-gold text-dark' : 'bg-gray-200 text-gray-600'
                }`}>
                  {auction.status}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-lg font-black text-dark uppercase tracking-tight mb-2 line-clamp-1">{auction.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                Starts: {new Date(auction.startTime).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-6 mb-8 py-4 border-y border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Lots</p>
                  <p className="text-sm font-black text-dark">{auction.totalLots}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Engagement</p>
                  <p className="text-sm font-black text-dark">{auction.totalBids || 0} Bids</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                  <p className="text-[10px] font-black text-gold uppercase">{auction.isPublished ? "Public" : "Draft"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/dashboard/client/auctions/${auction._id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-gray-50 hover:bg-gold hover:text-white rounded-2xl transition-all group/btn"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Crate</span>
                </Link>
                <Link 
                  href={`/auctions/${auction.slug}`}
                  className="p-3.5 bg-dark text-gold hover:text-white rounded-2xl transition-all"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {auctions.length === 0 && (
          <div className="lg:col-span-3 py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
            <div className="h-20 w-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
              <Monitor className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Boutiques</p>
            <p className="text-[10px] text-gray-300 font-bold uppercase mt-2">Start curating your first collection</p>
          </div>
        )}
      </div>
    </div>
  );
}
