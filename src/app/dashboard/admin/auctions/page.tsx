"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Gavel, Pause, Play, AlertTriangle, Eye, Search, Filter, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getAuctions({ search: searchTerm, status: statusFilter });
      setAuctions(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch auctions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [statusFilter]);

  const handleStatusUpdate = async (auction: any, newStatus: string) => {
    try {
      if (newStatus === 'cancelled') {
        const reason = prompt("Enter cancellation reason:");
        if (!reason) return;
        await adminAPI.cancelAuction(auction._id, reason);
      } else if (newStatus === 'suspended') {
        const reason = prompt("Enter suspension reason:");
        if (!reason) return;
        await adminAPI.suspendAuction(auction._id, reason);
      } else {
        await adminAPI.updateAuction(auction._id, { status: newStatus });
      }
      toast.success(`Auction ${newStatus} successfully`);
      fetchAuctions();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (isLoading && auctions.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Global Oversight</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Platform Auction Surveillance & Supervision</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); fetchAuctions(); }} className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search auctions by title..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <select
            className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="live">Live</option>
            <option value="scheduled">Scheduled</option>
            <option value="suspended">Suspended</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Auction House</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Collection</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Engagement</th>
                <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auctions.map((auction) => (
                <tr key={auction._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div>
                      <p className="text-xs font-black text-dark uppercase">{auction.client?.companyName || 'Private Client'}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{auction.client?.firstName} {auction.client?.lastName}</p>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm shrink-0">
                        <img src={auction.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-dark uppercase leading-tight">{auction.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ENDS {new Date(auction.endTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest ${
                      auction.status === 'live' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      auction.status === 'suspended' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="py-5">
                    <div>
                      <p className="text-sm font-black text-dark">{auction.totalLots} <span className="text-[10px] text-gray-400 font-bold uppercase">Lots</span></p>
                      <p className="text-[10px] text-gold font-black uppercase tracking-tighter">{auction.totalBids || 0} Total Bids</p>
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/auctions/${auction.slug}`}
                        className="p-2 bg-gray-50 text-dark hover:bg-gold hover:text-white rounded-xl transition-all"
                        title="View Auction"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      {auction.status === 'live' ? (
                        <button 
                          onClick={() => handleStatusUpdate(auction, 'suspended')}
                          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all"
                          title="Suspend Auction"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : auction.status === 'suspended' ? (
                        <button 
                          onClick={() => handleStatusUpdate(auction, 'live')}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                          title="Resume Auction"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      ) : null}

                      <button 
                        onClick={() => handleStatusUpdate(auction, 'cancelled')}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                        title="Cancel Auction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {auctions.length === 0 && (
            <div className="py-20 text-center opacity-50">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching auctions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
