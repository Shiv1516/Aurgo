"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Activity, Search, Filter, Shield, User, Clock, Terminal } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.error("Failed to fetch activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('reject') || action.includes('cancel')) return 'text-rose-500 bg-rose-50 border-rose-100';
    if (action.includes('create') || action.includes('approve') || action.includes('activate')) return 'text-green-500 bg-green-50 border-green-100';
    if (action.includes('update')) return 'text-blue-500 bg-blue-50 border-blue-100';
    return 'text-gray-500 bg-gray-50 border-gray-100';
  };

  if (isLoading && logs.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">System Audit</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">High-Fidelity Activity Surveillance</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-dark/5 rounded-xl border border-dark/5">
              <Terminal className="h-4 w-4 text-dark" />
              <span className="text-[10px] font-black uppercase tracking-widest">Total Events: {pagination.total || 0}</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {/* Search */}
        <div className="mb-8">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchLogs(); }} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by action, user, or resource..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Operator</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action Protocol</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Resource</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-bold">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-dark rounded-lg flex items-center justify-center text-gold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-dark uppercase">{log.user?.firstName} {log.user?.lastName}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{log.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest border ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-5">
                    <div>
                      <p className="text-[11px] font-black text-dark uppercase">{log.resource}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: ...{log.resourceId?.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-gray-400">{log.ipAddress || '0.0.0.0'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="py-20 text-center opacity-50">
              <Activity className="h-10 w-10 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No activity recorded in the sequence</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                  page === p ? 'bg-dark text-gold shadow-xl shadow-black/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
