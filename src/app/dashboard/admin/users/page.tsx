"use client";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { 
  User, Shield, UserX, UserCheck, Search, Filter, 
  Users, UserPlus, ShieldCheck, Mail, Globe, 
  ShieldAlert, Activity, ChevronRight, Edit2, Plus, Trash2
} from "lucide-react";
import { TableSkeleton } from "@/components/common/Skeletons";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    firstName: "", lastName: "", email: "", phone: "", 
    companyName: "", role: "", commissionRate: 10, isActive: true, clientApproved: false
  });
  const [addForm, setAddForm] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "user"
  });

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://aurgo-backend-1.onrender.com/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!data.success) return toast.error(data.error || "Failed to create user");
      
      if (addForm.role !== "user" && data.user?._id) {
        await adminAPI.updateUser(data.user._id, { role: addForm.role });
      }
      toast.success("User created successfully");
      setShowAddModal(false);
      setAddForm({ firstName: "", lastName: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await adminAPI.updateUser(selectedUser._id, editForm);
      toast.success("User updated successfully");
      setIsEditing(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to PERMANENTLY delete this user? This action cannot be undone.")) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success("User permanently deleted");
      setSelectedUser(null);
      setIsEditing(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  if (isLoading && users.length === 0) return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="h-24 w-1/2 bg-gray-100 animate-pulse rounded-2xl" />
      <TableSkeleton rows={10} cols={5} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Citizen Registry</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage global users, clients, and platform access.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-navy text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-navy-dark transition-colors font-bold tracking-wide shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add User
        </button>
        
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
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4">
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
                        onClick={() => {
                          setSelectedUser(citizen);
                          setEditForm({ 
                            firstName: citizen.firstName || "", lastName: citizen.lastName || "",
                            email: citizen.email || "", phone: citizen.phone || "", companyName: citizen.companyName || "",
                            role: citizen.role, commissionRate: citizen.commissionRate || 10, isActive: citizen.isActive !== false,
                            clientApproved: citizen.clientApproved || false
                          });
                          setIsEditing(true);
                        }}
                        className="p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(citizen)}
                        className={`p-2 rounded transition-colors ${citizen.isSuspended ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                        title={citizen.isSuspended ? "Restore access" : "Suspend access"}
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
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                 <Search className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit User Modal */}
      {selectedUser && isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsEditing(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 bg-navy/10 rounded-full flex items-center justify-center text-navy">
                  <Edit2 className="h-5 w-5" />
               </div>
               <h3 className="text-2xl font-bold text-navy uppercase tracking-tight">Edit Profile</h3>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">First Name</label>
                    <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Last Name</label>
                    <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" required />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone</label>
                    <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
                    >
                      <option value="user">Platform User</option>
                      <option value="client">Client (Seller)</option>
                      <option value="admin">Administrator</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                 </div>
                 {editForm.role === 'client' && (
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Commission Rate (%)</label>
                      <input
                        type="number" min="0" max="100"
                        value={editForm.commissionRate}
                        onChange={(e) => setEditForm({...editForm, commissionRate: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
                      />
                   </div>
                 )}
               </div>

               {editForm.role === 'client' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Company Name</label>
                    <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" />
                  </div>
               )}

               <div className="flex flex-col gap-3 py-4">
                 <label className="flex items-center gap-3">
                    <input type="checkbox" checked={editForm.isActive} onChange={e => setEditForm({...editForm, isActive: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-burgundy focus:ring-burgundy" />
                    <span className="text-sm font-bold text-gray-700">Account is Active (Allow Login)</span>
                 </label>
                 
                 {editForm.role === 'client' && (
                   <label className="flex items-center gap-3">
                      <input type="checkbox" checked={editForm.clientApproved} onChange={e => setEditForm({...editForm, clientApproved: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-burgundy focus:ring-burgundy" />
                      <span className="text-sm font-bold text-gray-700">Verify & Approve Client Status</span>
                   </label>
                 )}
               </div>

               <div className="flex gap-3 border-t mt-2 pt-6">
                <button type="submit" className="flex-[2] bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-dark transition-colors">
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
               </div>
               
               <div className="pt-4 flex justify-end">
                  <button type="button" onClick={() => handleDeleteUser(selectedUser._id)} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition">
                     <Trash2 className="h-4 w-4" /> Permanently Delete Account
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 bg-navy/10 rounded-full flex items-center justify-center text-navy">
                  <UserPlus className="h-5 w-5" />
               </div>
               <h3 className="text-2xl font-bold text-navy uppercase tracking-tight">Provision Identity</h3>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">First Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" value={addForm.firstName} onChange={e => setAddForm({...addForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Last Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" value={addForm.lastName} onChange={e => setAddForm({...addForm, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <input required type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Temporary Password</label>
                <input required type="text" minLength={8} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Assign Capability Profile</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none" value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})}>
                  <option value="user">Platform User</option>
                  <option value="client">Client (Seller)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t mt-6">
                <button type="submit" className="flex-[2] bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy-dark transition-colors">
                  Create Identity
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
