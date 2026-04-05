"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { userAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { 
  User, MapPin, Plus, Trash2, Upload, Shield, 
  Settings, Key, CreditCard, Bell, Globe, Phone,
  FileText, ShieldCheck, ArrowRight, Activity, ChevronRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-24"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="flex gap-1">
                <span className="w-1 h-3 bg-navy rounded-full" />
                <span className="w-1 h-3 bg-burgundy rounded-full" />
                <span className="w-1 h-3 bg-gold rounded-full" />
             </div>
             <span className="text-sm font-black text-navy/40 uppercase tracking-[0.1em]">Personal Vault</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Identity <span className="text-burgundy italic font-serif lowercase">Hub</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-gray-200 rounded-2xl px-6 py-3 shadow-xl shadow-black/[0.02] flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                 <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Login Security</p>
                 <p className="text-base font-black text-navy uppercase">2FA Active</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Configuration */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* Personal Information */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.03] border border-gray-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy/[0.02] rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-navy/[0.05] transition-all duration-1000" />
            
            <div className="flex items-center gap-4 mb-12 border-b border-gray-200 pb-8">
              <div className="h-14 w-14 bg-navy rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-navy/20">
                <User className="h-6 w-6 text-gold" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Profile Credentials</h3>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Primary identification on the platform</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] pl-1">Given Name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] pl-1">Family name</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] pl-1">Verified Gateway</label>
                  <div className="relative group/mail">
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full bg-navy/[0.02] border-none rounded-2xl px-14 py-4 text-sm font-black uppercase tracking-widest cursor-not-allowed opacity-60"
                    />
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/20" />
                    <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] pl-1">Tele-Verification</label>
                  <div className="relative group/phone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gray-50/50 border-none rounded-2xl px-14 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                      placeholder="+00 (0) 00 00 00 00"
                    />
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/20 group-focus-within/phone:text-gold transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-navy text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.1em] shadow-2xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Encrypting..." : "Update Vault Profile"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Logistics Nexus (Addresses) */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.03] border border-gray-200">
            <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-burgundy/10 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-burgundy/5">
                  <MapPin className="h-6 w-6 text-burgundy" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Logistics Nexus</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Primary physical destinations for acquisitions</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="group flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-navy hover:text-white rounded-[1.25rem] transition-all duration-500 font-black text-sm uppercase tracking-widest"
              >
                <Plus className={`h-4 w-4 transition-transform duration-500 ${showAddAddress ? 'rotate-45' : ''}`} />
                {showAddAddress ? 'Abort Registration' : 'Register Location'}
              </button>
            </div>

            <AnimatePresence>
               {showAddAddress && (
                 <motion.form
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: "auto" }}
                   exit={{ opacity: 0, height: 0 }}
                   onSubmit={handleAddAddress}
                   className="bg-gray-50/50 p-10 rounded-xl border border-gray-200 mb-12 space-y-8 overflow-hidden"
                 >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Location Alias</label>
                       <input
                         placeholder="e.g. European Residence"
                         value={addressForm.label}
                         onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                         className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                       />
                     </div>
                     <div className="space-y-3">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">National Jurisdiction</label>
                       <input
                         placeholder="Country"
                         required
                         value={addressForm.country}
                         onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                         className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                       />
                     </div>
                   </div>
                   <div className="space-y-3">
                     <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Physical Address</label>
                     <input
                       placeholder="Street, Building, Unit"
                       required
                       value={addressForm.street}
                       onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                       className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <input
                       placeholder="City"
                       required
                       value={addressForm.city}
                       onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                       className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                     />
                     <input
                       placeholder="State/Province"
                       required
                       value={addressForm.state}
                       onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                       className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                     />
                     <input
                       placeholder="Postal/ZIP"
                       required
                       value={addressForm.zipCode}
                       onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                       className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                     />
                   </div>
                   <button type="submit" className="bg-burgundy text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                      Confirm & Secure Location
                   </button>
                 </motion.form>
               )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {user?.addresses?.map((addr, i) => (
                <motion.div
                  key={addr._id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group p-8 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-700"
                >
                  <div className="pr-12">
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-base font-black text-navy uppercase tracking-tight">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="text-sm font-black bg-gold/10 text-gold-dark px-2.5 py-1 rounded-lg uppercase tracking-widest border border-gold/20">Primary</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                       <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                         {addr.street} <br />
                         {addr.city}, {addr.state} <br />
                         {addr.zipCode} • {addr.country}
                       </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addr._id && handleDeleteAddress(addr._id)}
                    className="absolute top-8 right-8 p-3 text-gray-300 hover:text-burgundy hover:bg-burgundy/5 rounded-2xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              {(!user?.addresses || user.addresses.length === 0) && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50/30">
                   <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <MapPin className="h-6 w-6 text-gray-200" />
                   </div>
                   <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-1">No Logistics Telemetry</h4>
                   <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.1em]">Add a location to facilitate acquisition delivery</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Intelligence */}
        <div className="xl:col-span-4 space-y-12">
          
          {/* KYC Status */}
          <motion.div variants={itemVariants} className="bg-navy rounded-xl p-10 text-white relative overflow-hidden shadow-2xl shadow-navy/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 bg-gold/10 rounded-[1.25rem] flex items-center justify-center border border-gold/10">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Trust Clearance</h3>
            </div>

            <div className="bg-white/5 rounded-xl p-8 border border-white/5 mb-10 group/kyc">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-white/40 uppercase tracking-[0.1em]">Platform Rank</span>
                  <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                    user?.kyc?.status === "verified" ? "bg-green-500/10 text-green-400 border border-green-500/20" : 
                    user?.kyc?.status === "pending" ? "bg-gold/10 text-gold border border-gold/20" : 
                    "bg-white/10 text-white/40"
                  }`}>
                    {user?.kyc?.status === 'verified' && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
                    {user?.kyc?.status || "Unverified"}
                  </div>
               </div>
               <p className="text-sm font-medium text-white/60 leading-relaxed mb-6">
                 {user?.kyc?.status === "verified"
                   ? "Full institutional bidding privileges unlocked. Platinum collection access granted."
                   : "Enhanced identity verification is required for acquisitions exceeding €100,000."}
               </p>
               {user?.kyc?.status !== "verified" && (
                 <label className="flex items-center justify-center gap-3 w-full py-4 bg-gold text-navy font-black text-sm uppercase tracking-[0.1em] rounded-2xl cursor-pointer hover:bg-white transition-all active:scale-95 shadow-xl shadow-gold/20">
                    <Upload className="h-4 w-4" /> Upload Credentials
                    <input type="file" multiple accept="image/*,.pdf" onChange={handleKYC} className="hidden" />
                 </label>
               )}
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/5 opacity-50">
               <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-1" />
               <p className="text-sm font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                 Augeo utilizes AES-256 military-grade encryption for all credential management. Zero-knowledge proof protocols ensure your sensitive data is never exposed.
               </p>
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.03] border border-gray-200">
             <h4 className="text-sm font-black text-burgundy uppercase tracking-[0.1em] mb-10">Vault Statistics</h4>
             <div className="space-y-8">
                {[
                  { label: 'Auctions Secured', value: user?.stats?.won || 0, icon: Award, color: 'text-gold' },
                  { label: 'Active Stratagems', value: user?.stats?.activeBids || 0, icon: Activity, color: 'text-burgundy' },
                  { label: 'Watchlist Density', value: user?.stats?.watchlistCount || 0, icon: Bell, color: 'text-navy' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}>
                          <stat.icon className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-3xl font-black text-navy tracking-tighter">{stat.value}</span>
                  </div>
                ))}
             </div>
             
             <div className="mt-12 pt-8 border-t border-gray-200">
                <Link href="/dashboard/settings" className="flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-navy text-white flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                         <Settings className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-black text-navy uppercase tracking-widest">Platform Settings</span>
                   </div>
                   <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

// Stub for missing icons if any, otherwise lucide has them
const Award = ({className}: {className: string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
