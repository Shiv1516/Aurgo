"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { User, Shield, UserX, UserCheck, Search, Filter } from "lucide-react";
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
      toast.error("Failed to fetch users");
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
        toast.success("User activated successfully");
      } else {
        await adminAPI.suspendUser(user._id, "Admin suspension");
        toast.success("User suspended successfully");
      }
      fetchUsers();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (isLoading && users.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Citizen Hub</h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Global User Management & Oversight</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex gap-4">
            <select
              className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold appearance-none cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="client">Clients</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Citizen</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-dark rounded-xl flex items-center justify-center text-gold">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-dark uppercase">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 rounded-lg text-gray-600 tracking-widest">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
                      {user.isSuspended ? (
                        <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Suspended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`p-2 rounded-xl transition-colors ${user.isSuspended ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                        title={user.isSuspended ? "Activate User" : "Suspend User"}
                      >
                        {user.isSuspended ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                      </button>
                      <button className="p-2 bg-gray-50 text-dark hover:bg-gray-100 rounded-xl transition-colors">
                        <Shield className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
