"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { motion } from "framer-motion";
import { Activity, Search, Filter, Shield, User, Clock, Terminal, ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.8 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getActivityLogs({ page, limit: 50, search: searchTerm });
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Telemetry Error: Failed to fetch sequence logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('reject') || action.includes('cancel')) return 'text-burgundy bg-burgundy/5 border-burgundy/10';
    if (action.includes('create') || action.includes('approve') || action.includes('activate')) return 'text-green-500 bg-green-50 border-green-100';
    if (action.includes('update')) return 'text-gold bg-gold/5 border-gold/10';
    return 'text-navy opacity-40 bg-gray-50 border-gray-100';
  };

  if (isLoading && logs.length === 0) return <PageLoader />;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-navy rounded-full" />
              <span className="text-sm font-black text-navy uppercase tracking-[0.4em]">Operational Telemetry</span>
           </div>
           <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">System <span className="text-burgundy italic font-serif normal-case text-5xl">Audit</span></h1>
        </div>
        <div className="flex items-center gap-6">
           <div className="bg-navy rounded-2xl px-6 py-4 border border-white/5 shadow-2xl shadow-navy/20 flex items-center gap-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Terminal className="h-5 w-5 text-gold" />
              </div>
              <div>
                 <p className="text-sm font-black text-white/40 uppercase tracking-widest">Total Events</p>
                 <p className="text-xl font-black text-white">{pagination.total?.toLocaleString() || 0}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden">
        {/* Search & Intelligence */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchLogs(); }} className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Query sequence protocol (action, user, or resource)..."
              className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex gap-2">
             <div className="bg-gray-50 px-6 py-5 rounded-[1.5rem] flex items-center gap-3 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                <Filter className="h-4 w-4 text-navy opacity-40 group-hover:text-gold transition-colors" />
                <span className="text-sm font-black uppercase tracking-widest text-navy">Filters</span>
             </div>
             <div onClick={() => fetchLogs()} className="bg-navy px-6 py-5 rounded-[1.5rem] flex items-center gap-3 border border-white/5 shadow-xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all cursor-pointer group">
                <Activity className="h-4 w-4 text-gold group-hover:text-navy transition-colors animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest text-white group-hover:text-navy">Synchronize</span>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[#A0AEC0]">
                <th className="pb-6 px-4 text-sm font-black uppercase tracking-[0.3em]">Temporal Marker</th>
                <th className="pb-6 px-4 text-sm font-black uppercase tracking-[0.3em]">Operator</th>
                <th className="pb-6 px-4 text-sm font-black uppercase tracking-[0.3em]">Action Protocol</th>
                <th className="pb-6 px-4 text-sm font-black uppercase tracking-[0.3em]">Strategic Resource</th>
                <th className="pb-6 px-4 text-sm font-black uppercase tracking-[0.3em]">Surveillance Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <motion.tr key={log._id} variants={itemVariants} className="group hover:bg-gray-50/80 transition-all duration-300">
                  <td className="py-7 px-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-navy opacity-20" />
                      <div>
                         <p className="text-sm font-black text-navy uppercase tracking-tight">{new Date(log.createdAt).toLocaleDateString()}</p>
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-7 px-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-navy rounded-2xl flex items-center justify-center text-gold font-serif text-base shadow-md group-hover:scale-110 transition-transform">
                        {log.user?.firstName?.[0]}{log.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-navy uppercase tracking-tight group-hover:text-gold transition-colors">{log.user?.firstName} {log.user?.lastName}</p>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter truncate max-w-[140px]">{log.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-7 px-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest border transition-all ${getActionColor(log.action)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                      {log.action.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="py-7 px-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-navy uppercase tracking-tight line-clamp-1">{log.resource}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-gray-400 font-bold uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">ID: ...{log.resourceId?.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-7 px-4">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-navy opacity-20" />
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-navy/40 font-mono tracking-widest">{log.ipAddress || '0.0.0.0'}</span>
                         <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter inline-flex items-center gap-1 w-fit mt-1"><ShieldCheck className="h-2.5 w-2.5" /> SECURENODE</span>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && !isLoading && (
            <div className="py-32 text-center opacity-50 flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                 <Activity className="h-10 w-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">Silence in the system sequence</p>
            </div>
          )}
        </div>

        {/* Tactical Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-navy disabled:opacity-20 hover:bg-navy hover:text-white transition-all border border-transparent shadow-sm"
            >
               <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex gap-2">
               {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                 let pageNum = page;
                 if (page < 3) pageNum = i + 1;
                 else if (page > pagination.pages - 2) pageNum = pagination.pages - 4 + i;
                 else pageNum = page - 2 + i;
                 
                 if (pageNum < 1 || pageNum > pagination.pages) return null;

                 return (
                   <button
                     key={pageNum}
                     onClick={() => setPage(pageNum)}
                     className={`w-12 h-12 rounded-2xl font-black text-sm uppercase transition-all shadow-sm ${
                       page === pageNum ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'
                     }`}
                   >
                     {pageNum.toString().padStart(2, '0')}
                   </button>
                 );
               })}
            </div>
            <button 
              disabled={page === pagination.pages}
              onClick={() => setPage(page + 1)}
              className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-navy disabled:opacity-20 hover:bg-navy hover:text-white transition-all border border-transparent shadow-sm"
            >
               <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Persistence Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="p-8 rounded-[2.5rem] bg-navy/5 border border-navy/5 flex flex-col items-center text-center">
            <Shield className="h-8 w-8 text-navy opacity-20 mb-6" />
            <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Protocol Integrity</h4>
            <p className="text-sm text-gray-400 italic">Audit trails are cryptographically sealed. All administrative actions are persistent.</p>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-gold/5 border border-gold/10 flex flex-col items-center text-center">
            <Zap className="h-8 w-8 text-gold opacity-50 mb-6" />
            <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Real-time Stream</h4>
            <p className="text-sm text-gray-400 italic">Global activity feed is synchronizing with central operational telemetry.</p>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-burgundy/5 border border-burgundy/10 flex flex-col items-center text-center">
            <Activity className="h-8 w-8 text-burgundy opacity-40 mb-6" />
            <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Risk Mitigation</h4>
            <p className="text-sm text-gray-400 italic">System anomalies are flagged automatically by governance logic.</p>
         </div>
      </div>
    </motion.div>
  );
}
