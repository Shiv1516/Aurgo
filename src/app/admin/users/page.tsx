"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Eye,
  Plus,
  Edit2
} from "lucide-react";
import { TableSkeleton } from "@/components/common/Skeletons";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    companyName: "", 
    role: "", 
    commissionRate: 10, 
    isActive: true 
  });
  
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user"
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt("Enter suspend reason") || "Violation of policies";
    if (!confirm("Are you sure you want to suspend this user?")) return;
    try {
      await adminAPI.suspendUser(id, reason);
      toast.success("User suspended");
      fetchUsers();
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await adminAPI.activateUser(id);
      toast.success("User activated");
      fetchUsers();
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
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
      
      if (!data.success) {
        toast.error(data.error || "Failed to create user");
        return;
      }
      
      // If elevating straight to admin or specific client logic, we immediately follow up with put:
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold text-dark">
          User Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 !py-2"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary !py-2">
              Search
            </button>
          </form>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="input-field w-40"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} cols={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    KYC
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm px-2 py-1 rounded-full font-medium ${
                          user.role === "superadmin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "admin"
                              ? "bg-orange-100 text-orange-700"
                              : user.role === "client"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : user.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${user.kyc?.status === "verified" ? "bg-green-100 text-green-700" : user.kyc?.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {user.kyc?.status || "none"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditForm({ 
                              firstName: user.firstName || "",
                              lastName: user.lastName || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              companyName: user.companyName || "",
                              role: user.role, 
                              commissionRate: user.commissionRate || 10,
                              isActive: user.isActive !== false
                            });
                            setIsEditing(false);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditForm({ 
                              firstName: user.firstName || "",
                              lastName: user.lastName || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              companyName: user.companyName || "",
                              role: user.role, 
                              commissionRate: user.commissionRate || 10,
                              isActive: user.isActive !== false
                            });
                            setIsEditing(true);
                          }}
                          className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleSuspend(user._id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-500"
                            title="Suspend"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user._id)}
                            className="p-1.5 hover:bg-green-50 rounded text-green-500"
                            title="Activate"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-base">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-bold">
                {isEditing ? "Edit User" : "User Details"}
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-sm font-bold text-burgundy flex items-center gap-1 hover:text-burgundy-dark"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateUser} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="input-field" required />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="input-field" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        className="input-field"
                      >
                        <option value="user">User</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                   </div>
                   {editForm.role === 'client' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editForm.commissionRate}
                          onChange={(e) => setEditForm({...editForm, commissionRate: Number(e.target.value)})}
                          className="input-field"
                        />
                     </div>
                   )}
                 </div>

                 {editForm.role === 'client' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="input-field" />
                    </div>
                 )}

                 <div className="flex items-center gap-2 pt-2 border-t mt-4 pb-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-burgundy focus:ring-burgundy"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Account is Active (Allow Login)</label>
                 </div>

                 <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary flex-[2] !py-2">Save Full Details</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-outline flex-1 !py-2">Cancel</button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteUser(selectedUser._id)} 
                    className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 rounded-xl transition font-bold !py-2"
                  >
                    Delete
                  </button>
                 </div>
              </form>
            ) : (
              <div className="space-y-3 text-base">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium">{selectedUser.isActive ? "Active" : "Disabled"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Verified:</span>
                    <p className="font-medium">
                      {selectedUser.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Joined:</span>
                    <p className="font-medium">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  {selectedUser.role === "client" && (
                     <div>
                       <span className="text-gray-500">Commission Rate:</span>
                       <p className="font-medium">{selectedUser.commissionRate || 10}%</p>
                     </div>
                  )}
                </div>
                {selectedUser.role === "client" && selectedUser.companyName && (
                  <div className="pt-3 border-t">
                    <span className="text-gray-500">Company:</span>
                    <p className="font-medium">{selectedUser.companyName}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t mt-4">
                  {selectedUser.isSuspended ? (
                    <button
                      onClick={() => handleActivate(selectedUser._id)}
                      className="btn-primary !bg-green-500 !py-2 flex-1"
                    >
                      Lift Suspension
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspend(selectedUser._id)}
                      className="btn-primary !bg-red-500 !py-2 flex-1"
                    >
                      Suspend User
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedUser(null); setIsEditing(false); }}
                    className="btn-outline flex-1 !py-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-heading font-bold mb-6">Create New User</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required type="text" className="input-field" value={addForm.firstName} onChange={e => setAddForm({...addForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required type="text" className="input-field" value={addForm.lastName} onChange={e => setAddForm({...addForm, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="input-field" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input required type="text" minLength={8} className="input-field" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                <select className="input-field" value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})}>
                  <option value="user">Standard User</option>
                  <option value="client">Client (Seller)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn-primary flex-1 !py-2">Create Account</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline flex-1 !py-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
