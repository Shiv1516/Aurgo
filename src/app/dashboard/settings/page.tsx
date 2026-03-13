"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  Lock, Bell, CreditCard, Shield, Zap, Key, 
  Settings as SettingsIcon, ChevronRight, Eye, 
  EyeOff, ShieldCheck, Mail, Activity
} from 'lucide-react';

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

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await userAPI.updateProfile({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Protocol updated. Security breach mitigated.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) { 
      toast.error(error.response?.data?.error || 'Authorization Failed'); 
    } finally { 
      setSaving(false); 
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
                <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span className="w-1.5 h-1.5 bg-navy rounded-full" />
             </div>
             <span className="text-sm font-black text-navy/40 uppercase tracking-[0.4em]">System Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Platform <span className="text-burgundy italic font-serif lowercase">Security</span>
          </h1>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-xl shadow-black/[0.02] flex items-center gap-4">
           <div className="p-2 rounded-lg bg-burgundy/10 text-burgundy">
              <ShieldCheck className="h-4 w-4" />
           </div>
           <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Protocol Version</p>
              <p className="text-base font-black text-navy uppercase">v4.0.2 Stable</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Security Matrix */}
        <div className="lg:col-span-12 space-y-12">
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Credential Rotation */}
            <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy/[0.02] rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-burgundy/[0.05] transition-all duration-1000" />
              
              <div className="flex items-center gap-4 mb-12 border-b border-gray-100 pb-10">
                <div className="h-14 w-14 bg-navy rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-navy/20">
                  <Key className="h-6 w-6 text-gold" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Credential Rotation</h3>
                   <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Manage authentication vectors</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Current Authorization</label>
                  <div className="relative">
                    <input 
                      type={showCurrent ? "text" : "password"} 
                      required 
                      value={passwords.currentPassword} 
                      onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                      className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-navy transition-colors">
                       {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] pl-1">New Signature</label>
                    <div className="relative">
                      <input 
                        type={showNew ? "text" : "password"} 
                        required 
                        minLength={8} 
                        value={passwords.newPassword} 
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} 
                        className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-navy transition-colors">
                         {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Confirm Signature</label>
                    <input 
                      type="password" 
                      required 
                      value={passwords.confirmPassword} 
                      onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                      className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-gold/50 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="bg-navy text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? 'Encrypting...' : 'Commit Protocol Update'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Neural Dispatch (Notifications) */}
            <motion.div variants={itemVariants} className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gold/[0.02] rounded-full -ml-32 -mt-32 blur-3xl group-hover:bg-gold/[0.05] transition-all duration-1000" />
              
              <div className="flex items-center gap-4 mb-12 border-b border-gray-100 pb-10">
                <div className="h-14 w-14 bg-burgundy/10 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-burgundy/5">
                  <Bell className="h-6 w-6 text-burgundy" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Intelligence Dispatch</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Configure alerting thresholds</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'outbid', label: 'Outbid Strategem Alerts', icon: Zap },
                  { id: 'starting', label: 'Auction Initiation Signals', icon: Activity },
                  { id: 'ending', label: 'Critical Ending Intervals', icon: Clock },
                  { id: 'won', label: 'Acquisition Finalization', icon: Trophy },
                  { id: 'payment', label: 'Fiscal Protocol Reminders', icon: CreditCard },
                  { id: 'shipping', label: 'Logistics Telemetry Updates', icon: Truck }
                ].map((pref, i) => (
                  <label key={pref.id} className="flex items-center justify-between p-6 bg-gray-50/30 rounded-[1.5rem] hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer group/item">
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-navy/40 group-hover/item:bg-navy group-hover/item:text-gold transition-all">
                          <pref.icon className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-sm font-black text-navy uppercase tracking-tighter opacity-70 group-hover/item:opacity-100 transition-opacity">{pref.label}</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy"></div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tertiary Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <motion.div variants={itemVariants} className="bg-navy rounded-[3rem] p-12 text-white shadow-2xl shadow-navy/30 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-125 group-hover:scale-150 transition-transform duration-1000">
                   <CreditCard className="h-48 w-48" />
                </div>
                <div className="relative z-10">
                   <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-gold">Fiscal Integration</h4>
                   <p className="text-sm font-bold text-white/40 uppercase tracking-[0.4em] leading-relaxed mb-8">
                      Payment architectures are managed exclusively via Stripe\'s secure hardware modules. Augeo never stores full fiscal credentials on platform infrastructure.
                   </p>
                   <button className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-navy rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                      Verify Wallet Status
                   </button>
                </div>
             </motion.div>

             <motion.div variants={itemVariants} className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 group relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                   <Shield className="h-48 w-48" />
                </div>
                <div className="relative z-10">
                   <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-navy">Integrity Audit</h4>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.4em] leading-relaxed mb-8">
                      Review all administrative actions, session history, and geofencing logs associated with your identity vault. Full audit trail available for export.
                   </p>
                   <button className="px-8 py-3 bg-navy text-white hover:bg-gold hover:text-navy rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                      Export Audit Log
                   </button>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// Stub for missing icons if any
const Trophy = ({className}: {className: string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const Clock = ({className}: {className: string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Truck = ({className}: {className: string}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;