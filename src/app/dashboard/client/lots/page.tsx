"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clientAPI, auctionAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { 
  Package, Edit3, Trash2, Tag, Gavel, LayoutGrid, 
  Search, Filter, Plus, Box, ShieldCheck, 
  Database, Activity, ChevronRight, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function ClientLotsPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const auctionsRes = await clientAPI.getAuctions();
      setAuctions(auctionsRes.data.data);
      
      if (selectedAuction || auctionsRes.data.data.length > 0) {
        const targetAuctionId = selectedAuction || auctionsRes.data.data[0]._id;
        if (!selectedAuction) setSelectedAuction(targetAuctionId);
        
        const lotsRes = await clientAPI.getLots(targetAuctionId);
        setLots(lotsRes.data.data);
      }
    } catch (error) {
      toast.error("Telemetry failure: Portfolio data inaccessible");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAuction]);

  const handleDelete = async (lotId: string) => {
    if (!confirm("Confirm asset liquidation? This will void the item from current curation.")) return;
    try {
      await clientAPI.deleteLot(lotId);
      toast.success("Asset Purged: Inventory updated");
      fetchData();
    } catch (error) {
      toast.error("Operation Failed: Unauthorized removal");
    }
  };

  if (isLoading && lots.length === 0) return <PageLoader />;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Inventory Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span className="w-1.5 h-1.5 bg-navy rounded-full" />
             </div>
             <span className="text-sm font-black text-navy/40 uppercase tracking-[0.4em]">Asset Logistics Hub</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Inventory <span className="text-burgundy italic font-serif lowercase">Matrix</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           {[
             { label: 'Active Inventory', value: lots.length, icon: Box, color: 'text-navy' },
             { label: 'Asset Valuation', value: 'Verified', icon: ShieldCheck, color: 'text-green-500' }
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-xl shadow-black/[0.02] flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                   <stat.icon className="h-4 w-4" />
                </div>
                <div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-base font-black text-navy uppercase">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden">
        {/* Subtle Data Waves */}
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-navy via-gold to-burgundy opacity-20" />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 relative z-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-burgundy transition-colors" />
            <input
              type="text"
              placeholder="Query asset title or origin..."
              className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-[1.5rem] text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Database className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gold transition-colors" />
            <select
              className="pl-14 pr-10 py-5 bg-gray-50 border-none rounded-[1.5rem] text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-navy/5 appearance-none cursor-pointer shadow-inner min-w-[240px]"
              value={selectedAuction}
              onChange={(e) => setSelectedAuction(e.target.value)}
            >
              {auctions.map((a) => (
                <option key={a._id} value={a._id}>{a.title.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {lots.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase())).map((lot) => (
              <motion.div 
                key={lot._id}
                layout
                variants={itemVariants}
                className="bg-white rounded-[2.5rem] border border-gray-100 group hover:border-gold transition-all overflow-hidden shadow-xl shadow-black/[0.01]"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                  <img src={lot.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'} alt={lot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 right-4">
                    <span className="text-sm font-black text-white bg-navy/80 px-3 py-1.5 rounded-xl uppercase tracking-widest backdrop-blur-md border border-white/10">
                      LOT #{(lot.lotNumber || '000').toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-1 line-clamp-1">{lot.title}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Acquisition by</span>
                       <p className="text-sm text-navy font-black uppercase tracking-widest">{lot.artist || 'Private Boutique'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-inner group-hover:bg-white transition-colors">
                    <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest">
                      <span className="text-gray-400">Valuation</span>
                      <span className="text-navy">${lot.estimatedLow?.toLocaleString()} - ${lot.estimatedHigh?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest">
                      <span className="text-gray-400">Sphere</span>
                      <span className={`px-2 py-0.5 rounded-lg border ${
                        lot.status === 'sold' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-navy/5 text-navy/40 border-navy/10'
                      }`}>
                        {lot.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-navy text-white hover:bg-gold hover:text-navy rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-navy/5 active:scale-95">
                      <Edit3 className="h-3.5 w-3.5" /> Modify
                    </button>
                    <button 
                      onClick={() => handleDelete(lot._id)}
                      className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Add New Asset Trigger */}
          <motion.button 
            variants={itemVariants}
            className="bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 hover:bg-white hover:border-gold hover:shadow-2xl hover:shadow-black/5 transition-all group min-h-[400px]"
          >
            <div className="h-20 w-20 bg-white rounded-3xl shadow-xl shadow-black/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-navy transition-all duration-500">
              <Plus className="h-10 w-10 text-gray-200 group-hover:text-gold" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-navy transition-colors">Add New Asset</p>
          </motion.button>
        </div>
      </div>

      {/* Inventory Intel Footer */}
      <div className="bg-navy rounded-[3rem] p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white rounded-full scale-150 rotate-[30deg]" />
         </div>
         <div className="relative z-10 flex flex-col items-center text-center">
            <Database className="h-10 w-10 text-gold mb-6" />
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Unified Repository</h4>
            <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em] max-w-2xl leading-relaxed">
               Inventory assets are cryptographically tracked from acquisition through final transmission. Our boutique partners maintain full oversight of provenance data and asset telemetry.
            </p>
         </div>
      </div>
    </motion.div>
  );
}
