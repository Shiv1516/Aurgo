"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { 
  User, Shield, UserX, UserCheck, Search, Filter, 
  Users, UserPlus, ShieldCheck, Mail, Globe, 
  ShieldAlert, Activity, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getUsers({ search: searchTerm, role: roleFilter });
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleStatusToggle = async (user: any) => {
    try {
      if (user.isSuspended) {
        await adminAPI.activateUser(user._id);
        toast.success("User access restored successfully.");
      } else {
        await adminAPI.suspendUser(user._id, "Admin intervention");
        toast.success("User access suspended.");
      }
      fetchUsers();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  if (isLoading && users.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Citizen Registry</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage global users, clients, and platform access.</p>
        </div>
        
        <div className="flex gap-4">
           {[
             { label: 'Platform Users', value: users.length, icon: Users, color: 'text-navy' },
             { label: 'Security State', value: 'Optimal', icon: ShieldCheck, color: 'text-green-600' }
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
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-burgundy transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="relative group min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy appearance-none cursor-pointer shadow-sm outline-none transition-all"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Platform Users</option>
              <option value="client">Auction Houses</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">User Profile</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((citizen) => (
                <tr 
                  key={citizen._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-navy/5 rounded-full flex items-center justify-center text-navy shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">{citizen.firstName} {citizen.lastName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                           <Mail className="h-3 w-3 text-gray-400" />
                           <p className="text-sm text-gray-500">{citizen.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-bold uppercase tracking-wide border ${
                      citizen.role === 'admin' ? 'bg-burgundy/5 text-burgundy border-burgundy/20' : 
                      citizen.role === 'client' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {citizen.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {citizen.isSuspended ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-sm font-bold uppercase tracking-wide border border-red-200">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 text-sm font-bold uppercase tracking-wide border border-green-200">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                       <Globe className="h-3.5 w-3.5" />
                       {new Date(citizen.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStatusToggle(citizen)}
                        className={`p-2 rounded transition-colors ${citizen.isSuspended ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                        title={citizen.isSuspended ? "Restore User" : "Suspend User"}
                      >
                        {citizen.isSuspended ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="py-24 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                 <Search className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
