"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { formatDate, getAuctionStatusColor, getAssetUrl } from '@/lib/utils';
import { PageLoader } from "@/components/common/LoadingSpinner";
import { 
  Gavel, Pause, Play, AlertTriangle, Eye, Search, Filter, 
  Trash2, Globe, Activity, TrendingUp, Box, Users, ShieldAlert,
  ChevronRight, Calendar, BarChart3, Clock
} from "lucide-react";
import Link from "next/link";
import { TableSkeleton } from "@/components/common/Skeletons";
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

  if (isLoading && auctions.length === 0) return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="h-24 w-1/2 bg-gray-100 animate-pulse rounded-2xl" />
      <TableSkeleton rows={10} cols={5} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Global Oversight</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Monitor and manage all active platform auctions</p>
        </div>
        
        <div className="flex gap-4">
           {[
             { label: 'Active Streams', value: auctions.filter(a => a.status === 'live').length, icon: Activity, color: 'text-green-600' },
             { label: 'Platform Load', value: 'Nominal', icon: ShieldAlert, color: 'text-burgundy' }
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm flex items-center gap-4">
                <div className={`p-2 rounded bg-gray-50 ${stat.color}`}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-base font-bold text-navy">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4">
          <form onSubmit={(e) => { e.preventDefault(); fetchAuctions(); }} className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-burgundy transition-colors" />
            <input
              type="text"
              placeholder="Search catalog or maison..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="relative group min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy appearance-none cursor-pointer shadow-sm outline-none transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="live">Live Now</option>
              <option value="scheduled">Scheduled</option>
              <option value="suspended">Suspended</option>
              <option value="closed">Closed / Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Maison / Origin</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Auction Asset</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">State</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Statistics</th>
                <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auctions.map((auction) => (
                <tr 
                  key={auction._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <p className="text-sm font-bold text-navy truncate max-w-[150px]">{auction.client?.companyName || 'Private Boutique'}</p>
                       <div className="flex items-center gap-1.5 mt-0.5">
                          <Users className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-500">{auction.client?.firstName}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 overflow-hidden rounded bg-gray-100 border border-gray-200 shrink-0">
                        <img 
                          src={getAssetUrl(auction.coverImage)} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="max-w-[180px]">
                        <p className="text-sm font-bold text-navy leading-tight line-clamp-2">{auction.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                           <Calendar className="h-3 w-3" />
                           <p className="text-sm uppercase font-bold">{new Date(auction.endTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-bold uppercase tracking-wide border ${
                       auction.status === 'live' ? 'bg-green-50 text-green-700 border-green-200' :
                       auction.status === 'suspended' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                       auction.status === 'closed' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                       'bg-white text-gray-600 border-gray-200'
                     }`}>
                       {auction.status === 'live' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                       {auction.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-navy">
                      <div className="flex items-center gap-1.5">
                         <span className="font-bold">{auction.totalLots}</span> <span className="text-gray-500 text-sm uppercase">Lots</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <span className="font-bold">{auction.totalBids || 0}</span> <span className="text-gray-500 text-sm uppercase">Bids</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/auctions/${auction.slug}`}
                        className="p-1.5 text-gray-400 hover:text-navy transition-colors bg-white border border-transparent hover:border-gray-200 rounded"
                        title="View Live"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      {auction.status === 'live' && (
                        <button 
                          onClick={() => handleStatusUpdate(auction, 'suspended')}
                          className="p-1.5 text-amber-600 transition-colors bg-amber-50 rounded"
                          title="Suspend Auction"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      
                      {auction.status === 'suspended' && (
                        <button 
                          onClick={() => handleStatusUpdate(auction, 'live')}
                          className="p-1.5 text-green-600 transition-colors bg-green-50 rounded"
                          title="Resume Auction"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}

                      <button 
                        onClick={() => handleStatusUpdate(auction, 'cancelled')}
                        className="p-1.5 text-red-600 transition-colors bg-red-50 rounded"
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
            <div className="py-24 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                 <BarChart3 className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No auctions match the current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
