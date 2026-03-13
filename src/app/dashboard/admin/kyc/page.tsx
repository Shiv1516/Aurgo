"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ShieldCheck, ShieldAlert, Eye, FileText, User, ArrowRight, Activity, Zap, CheckCircle2, AlertTriangle, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import { timeAgo } from "@/lib/utils";

export default function AdminKYCPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchKYC = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getPendingKYC();
      setRequests(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch pending KYC requests");
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
      toast.success("Identity verified and approved.");
      fetchKYC();
      setSelectedUser(null);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await adminAPI.rejectKYC(userId, reason);
      toast.success("KYC submission rejected.");
      fetchKYC();
      setSelectedUser(null);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (isLoading && requests.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
           <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Identity Verification</h1>
           <p className="text-sm font-medium text-gray-500 mt-1">Review and authorize client and maison partners.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm flex items-center gap-6">
              <div className="text-center">
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Pending KYC</p>
                 <p className="text-xl font-bold text-navy">{requests.length}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                 <div className="inline-flex items-center gap-1.5 text-green-600 text-sm font-bold uppercase tracking-wide">
                   <ShieldCheck className="h-4 w-4" /> Operational
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - List of Users */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy uppercase tracking-tight">Pending Submissions</h2>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-600">All identity verification queues are currently empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((user) => (
                <div 
                  key={user._id} 
                  onClick={() => setSelectedUser(user)}
                  className={`bg-white rounded-xl p-5 border transition-all cursor-pointer group flex items-center justify-between ${selectedUser?._id === user._id ? 'border-burgundy ring-1 ring-burgundy shadow-sm' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded bg-gray-50 flex items-center justify-center font-bold text-lg border ${selectedUser?._id === user._id ? 'text-burgundy border-burgundy/20' : 'text-navy border-gray-200'}`}>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className={`text-base font-bold uppercase tracking-tight ${selectedUser?._id === user._id ? 'text-burgundy' : 'text-navy'}`}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-sm font-bold text-gray-500">
                         <span className="uppercase tracking-widest">{user.role}</span>
                         <span className="h-1 w-1 bg-gray-300 rounded-full" />
                         <span className="truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-colors ${selectedUser?._id === user._id ? 'text-burgundy' : 'text-gray-300 group-hover:text-navy'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Audit Details */}
        <div className="lg:col-span-5 border-l border-gray-200 lg:pl-8">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Identity Dossier</h3>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">ID: {selectedUser._id.substring(0,8)}</p>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-navy rounded hover:bg-white transition-colors">
                    <X className="h-5 w-5" />
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Account Info */}
                <div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Information</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded border border-gray-100">
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">First Name</p>
                         <p className="text-sm font-bold text-navy">{selectedUser.firstName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded border border-gray-100">
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Last Name</p>
                         <p className="text-sm font-bold text-navy">{selectedUser.lastName}</p>
                      </div>
                      <div className="col-span-2 p-3 bg-gray-50 rounded border border-gray-100">
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
                         <p className="text-sm font-bold text-navy">{selectedUser.email}</p>
                      </div>
                   </div>
                </div>

                {/* Strategic Documents */}
                <div>
                   <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Submitted Assets</p>
                      <span className="bg-gray-100 text-gray-600 text-sm font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                         {selectedUser.kycDocuments?.length || 0} Files
                      </span>
                   </div>
                   
                   <div className="space-y-2">
                      {selectedUser.kycDocuments?.length > 0 ? selectedUser.kycDocuments.map((doc: any, i: number) => (
                        <a 
                          key={i} 
                          href={doc.url?.startsWith('http') ? doc.url : `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${doc.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 hover:border-burgundy hover:shadow-sm rounded transition-all group/asset"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400 group-hover/asset:text-burgundy transition-colors">
                               <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-navy group-hover/asset:text-burgundy transition-colors uppercase">{doc.type || 'Identity Document'}</span>
                            </div>
                          </div>
                          <Eye className="h-4 w-4 text-gray-300 group-hover/asset:text-burgundy transition-colors" />
                        </a>
                      )) : (
                        <div className="flex items-center gap-3 p-4 rounded bg-amber-50 border border-amber-200">
                           <AlertTriangle className="h-5 w-5 text-amber-500" />
                           <p className="text-sm text-amber-700 font-bold uppercase tracking-wide">No documents uploaded by user.</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
                <button 
                  onClick={() => handleReject(selectedUser._id)}
                  className="px-6 py-2 bg-white border border-gray-300 hover:border-red-300 hover:bg-red-50 text-red-600 rounded font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(selectedUser._id)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-[500px]">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                 <ShieldAlert className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-navy uppercase tracking-tight mb-2">No Dossier Selected</h3>
              <p className="text-sm font-medium text-gray-500 max-w-xs leading-relaxed">
                Select a user from the list to initiate protocols and verify their documentation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
