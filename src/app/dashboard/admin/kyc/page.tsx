"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ShieldCheck, ShieldAlert, Eye, CheckCircle, XCircle, FileText, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminKYCPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchKYC = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getPendingKYC();
      setRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch KYC requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await adminAPI.approveKYC(userId);
      toast.success("KYC approved successfully");
      fetchKYC();
      setSelectedUser(null);
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await adminAPI.rejectKYC(userId, reason);
      toast.success("KYC rejected");
      fetchKYC();
      setSelectedUser(null);
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  if (isLoading && requests.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Audit Chamber</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Identity Verification & Compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-100 shadow-xl shadow-black/[0.02]">
              <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-10 w-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Pending Audits</p>
            </div>
          ) : (
            requests.map((user) => (
              <div 
                key={user._id} 
                onClick={() => setSelectedUser(user)}
                className={`bg-white rounded-[2rem] p-6 border transition-all cursor-pointer group hover:shadow-2xl hover:shadow-black/[0.05] ${selectedUser?._id === user._id ? 'border-gold ring-1 ring-gold shadow-gold/10' : 'border-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-dark rounded-xl flex items-center justify-center text-gold">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-dark uppercase">{user.firstName} {user.lastName}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Documents</p>
                    <div className="flex gap-1 justify-end">
                      {user.kycDocuments?.map((_: any, i: number) => (
                        <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Audit Details */}
        <div className="sticky top-8">
          {selectedUser ? (
            <div className="bg-dark rounded-[2.5rem] p-8 shadow-2xl shadow-gold/10 text-white animate-fade-in">
              <h3 className="text-lg font-black uppercase tracking-tight mb-8">Verification Dossier</h3>
              
              <div className="space-y-6 mb-10">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-2">Primary Intent</p>
                  <p className="text-sm font-bold">{selectedUser.role.toUpperCase()} VERIFICATION</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-2">Submitted Assets</p>
                  {selectedUser.kycDocuments?.map((doc: any, i: number) => (
                    <a 
                      key={i} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group/asset"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{doc.type || 'Identity Document'}</span>
                      </div>
                      <Eye className="h-4 w-4 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleReject(selectedUser._id)}
                  className="p-4 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-500/20"
                >
                  Reject Access
                </button>
                <button 
                  onClick={() => handleApprove(selectedUser._id)}
                  className="p-4 bg-gold hover:bg-white text-dark rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  Approve Entry
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 flex flex-col items-center justify-center h-full opacity-50">
              <ShieldAlert className="h-10 w-10 text-gray-200 mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Select a dossier to audit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
