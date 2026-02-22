"use client";
import { useState, useEffect } from "react";
import { clientAPI, auctionAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Package, Edit3, Trash2, Tag, Gavel, LayoutGrid, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function ClientLotsPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get client's auctions first to filter lots
      const auctionsRes = await clientAPI.getAuctions();
      setAuctions(auctionsRes.data.data);
      
      // If we have an auction selected, get its lots, otherwise we might need a general lot endpoint
      // Assuming for now we show lots from a specific auction or the first one
      if (selectedAuction || auctionsRes.data.data.length > 0) {
        const targetAuctionId = selectedAuction || auctionsRes.data.data[0]._id;
        if (!selectedAuction) setSelectedAuction(targetAuctionId);
        
        const lotsRes = await clientAPI.getLots(targetAuctionId);
        setLots(lotsRes.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAuction]);

  const handleDelete = async (lotId: string) => {
    if (!confirm("Are you sure? This will remove the item from the collection.")) return;
    try {
      await clientAPI.deleteLot(lotId);
      toast.success("Lot removed successfully");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  if (isLoading && lots.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Global Inventory</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Industrial-Grade Asset Management</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by title or artist..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold appearance-none cursor-pointer"
            value={selectedAuction}
            onChange={(e) => setSelectedAuction(e.target.value)}
          >
            {auctions.map((a) => (
              <option key={a._id} value={a._id}>{a.title.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lots.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase())).map((lot) => (
            <div key={lot._id} className="bg-white rounded-[2rem] border border-gray-50 group hover:border-gold transition-all overflow-hidden shadow-xl shadow-black/[0.01]">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img src={lot.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'} alt={lot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4">
                  <span className="text-[9px] font-black text-white bg-dark/80 px-2 py-1 rounded-lg uppercase tracking-widest backdrop-blur-sm">
                    LOT {lot.lotNumber}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-sm font-black text-dark uppercase tracking-tight mb-1 line-clamp-1">{lot.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">{lot.artist || 'Unattributed'}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-gray-400">Estimate</span>
                    <span className="text-dark">${lot.estimatedLow} - ${lot.estimatedHigh}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                    <span className="text-gray-400">Status</span>
                    <span className={`px-2 py-0.5 rounded-md ${lot.status === 'sold' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>{lot.status}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-2.5 bg-gray-50 text-dark hover:bg-gold hover:text-white rounded-xl transition-all">
                    <Edit3 className="h-4 w-4 mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleDelete(lot._id)}
                    className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Lot Trigger */}
          <button className="bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 hover:bg-gold/5 hover:border-gold/30 transition-all group">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6 text-gray-300 group-hover:text-gold" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-gold">Add New Lot</p>
          </button>
        </div>
      </div>
    </div>
  );
}
