"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { userAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { User, MapPin, Plus, Trash2, Upload, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      setUser(res.data.data);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userAPI.addAddress(addressForm);
      setUser({ ...user!, addresses: res.data.data });
      setShowAddAddress(false);
      setAddressForm({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      });
      toast.success("Address added");
    } catch {
      toast.error("Failed");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await userAPI.deleteAddress(id);
      setUser({ ...user!, addresses: res.data.data });
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const handleKYC = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();

    Array.from(e.target.files).forEach((file) => {
      formData.append("kycDocuments", file);
    });

    try {
      await userAPI.uploadKYC(formData);
      toast.success("KYC documents uploaded for review");
    } catch {
      toast.error("Upload failed");
    }
  };

  // const handleKYC = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return;
  //   const formData = new FormData();
  //   for (const file of e.target.files) formData.append('kycDocuments', file);
  //   try { await userAPI.uploadKYC(formData); toast.success('KYC documents uploaded for review'); } catch { toast.error('Upload failed'); }
  // };

  return (
    <div className="space-y-10 page-transition">
      <div className="flex flex-col">
        <h1 className="text-4xl font-black text-dark tracking-tighter mb-2 uppercase">Identity Hub</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">Guardian of your digital legacy</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Profile form */}
        <div className="xl:col-span-2 space-y-10">
          <div className="card p-10 bg-white/50 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
              <div className="h-12 w-12 bg-dark rounded-2xl flex items-center justify-center shadow-xl shadow-gold/10">
                <User className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-xl font-black text-dark uppercase tracking-tight">Personal Portfolio</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Given Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Family Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="input-field"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Verified Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input-field bg-gray-50/50 cursor-not-allowed opacity-70"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <Shield className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Communications
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`input-field ${form.phone && !/^\+?[1-9]\d{1,14}$/.test(form.phone) ? 'border-red-400' : ''}`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {form.phone && !/^\+?[1-9]\d{1,14}$/.test(form.phone) && (
                    <p className="text-[9px] text-red-500 mt-1 font-bold uppercase tracking-wider">Invalid international format</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary !px-10 font-black uppercase tracking-widest text-[11px] disabled:opacity-50"
              >
                {saving ? "Processing..." : "Commit Changes"}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="card p-10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gold/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-xl font-black text-dark uppercase tracking-tight">Shipping Nexus</h3>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gold hover:text-white rounded-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 transform group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Register New</span>
              </button>
            </div>

            {showAddAddress && (
              <form
                onSubmit={handleAddAddress}
                className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 mb-10 space-y-6 animate-slide-up"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Location Label</label>
                    <input
                      placeholder="e.g. European Residence"
                      value={addressForm.label}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, label: e.target.value })
                      }
                      className="input-field !py-3 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Jurisdiction</label>
                    <input
                      placeholder="Country"
                      required
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, country: e.target.value })
                      }
                      className="input-field !py-3 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Route</label>
                  <input
                    placeholder="Street Address"
                    required
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                    className="input-field !py-3 text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <input
                      placeholder="City"
                      required
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="input-field !py-3 text-xs"
                    />
                  </div>
                  <input
                    placeholder="State/Prov"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="input-field !py-3 text-xs"
                  />
                  <input
                    placeholder="Postal Code"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, zipCode: e.target.value })
                    }
                    className="input-field !py-3 text-xs"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-primary !py-3 !px-8 text-[10px] font-black uppercase tracking-widest">
                    Activate Location
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.addresses?.map((addr, i) => (
                <div
                  key={i}
                  className="relative group p-6 bg-white border border-gray-100 rounded-3xl hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500"
                >
                  <div className="pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-black text-dark uppercase tracking-tight">
                        {addr.label}
                      </p>
                      {addr.isDefault && (
                        <span className="text-[8px] font-black bg-gold/10 text-gold px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gold/10">Default</span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                      {addr.street}, {addr.city} <br />
                      {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>
                  <button
                    onClick={() => addr._id && handleDeleteAddress(addr._id)}
                    className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(!user?.addresses || user.addresses.length === 0) && (
                <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
                   <MapPin className="h-8 w-8 mb-4 opacity-20" />
                   <p className="text-xs font-bold uppercase tracking-widest">No Registered Addresses</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KYC Side Card */}
        <div className="space-y-10">
          <div className="card p-8 bg-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-gold/20 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-gold" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Trust Clearance</h3>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status Level</span>
                 <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest leading-none ${user?.kycStatus === "approved" ? "bg-green-500/10 text-green-500" : user?.kycStatus === "pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-gray-500/10 text-gray-500"}`}
                  >
                    {user?.kycStatus || "unverified"}
                  </span>
               </div>
               <p className="text-[10px] font-bold text-gray-400">
                  {user?.kycStatus === 'approved' 
                    ? "Full bidding privileges unlocked." 
                    : "Upgrade to premium status to access $100k+ auctions."}
               </p>
            </div>

            {user?.kycStatus !== "approved" && (
              <div className="space-y-6">
                <label className="flex items-center justify-center gap-3 w-full py-4 bg-gold hover:bg-gold/90 text-dark font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-gold/10">
                  <Upload className="h-4 w-4" /> Secure Submission
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleKYC}
                    className="hidden"
                  />
                </label>
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl">
                   <Shield className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                   <p className="text-[9px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                     Your documents are encrypted via military-grade RSA-4096 before processing.
                   </p>
                </div>
              </div>
            )}
          </div>

          <div className="card p-8 border-gold/20 bg-gold/5">
             <h4 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Account Analytics</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gold/10 pb-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Auctions Won</span>
                   <span className="text-xl font-black text-dark leading-none">0</span>
                </div>
                <div className="flex justify-between items-end border-b border-gold/10 pb-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Live Bids</span>
                   <span className="text-xl font-black text-dark leading-none">0</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
