"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Gavel, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Security Protocol: Minimum 8 characters required'); return; }

    setIsLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone });
      toast.success('Protocol Initiated: Identity registered. Check email for verification.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-gold rounded-full blur-[140px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-burgundy rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 text-gold">
             <div className="h-px w-8 bg-gold/30" />
             <Sparkles className="h-5 w-5" />
             <div className="h-px w-8 bg-gold/30" />
          </div>
          <h1 className="text-6xl font-black text-navy tracking-tighter uppercase leading-none mb-4">
            Enrollment <span className="text-burgundy italic font-serif lowercase">Protocol</span>
          </h1>
          <p className="text-sm font-black text-gray-500 uppercase tracking-[0.1em]">Initialize Your Strategic Persona</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.04] border border-gray-200 relative group overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black text-gray-500 uppercase ml-1">First Name</label>
                <div className="relative group/field">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within/field:text-navy transition-colors" />
                  <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none" placeholder="John" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black text-gray-500 uppercase ml-1">Second Name</label>
                <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} className="w-full px-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-black text-gray-500 uppercase ml-1">Email</label>
              <div className="relative group/field">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within/field:text-gold transition-colors" />
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none" placeholder="name@domain.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-black text-gray-500 uppercase ml-1">Number</label>
              <div className="relative group/field">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within/field:text-navy transition-colors" />
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-black text-gray-500 uppercase ml-1">Password</label>
              <div className="relative group/field">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within/field:text-burgundy transition-colors" />
                <input 
                  type="password" 
                  required 
                  value={form.password} 
                  onChange={e => {
                      update('password', e.target.value);
                      setPasswordStrength(calculateStrength(e.target.value));
                  }} 
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none" 
                  placeholder="Min 8 Complex Characters" 
                />
              </div>
              {form.password && (
                <div className="mt-2 flex gap-1.5 px-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= passwordStrength ? (passwordStrength <= 2 ? 'bg-burgundy' : passwordStrength === 3 ? 'bg-gold' : 'bg-green-500') : 'bg-gray-50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-black text-gray-500 uppercase ml-1">Re-enter Password</label>
              <div className="relative group/field">
                <CheckCircle2 className={`absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${form.confirmPassword && form.password === form.confirmPassword ? 'text-green-500' : 'text-gray-300'}`} />
                <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className={`w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none ${form.confirmPassword && form.password !== form.confirmPassword ? 'bg-burgundy/5' : ''}`} placeholder="Re-enter security key" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 bg-navy text-white rounded-xl transition-all font-black uppercase tracking-[0.1em] shadow-2xl shadow-navy/20 hover:bg-burgundy hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3 mt-6 group"
            >
              {isLoading ? 'Enrolling Identity...' : 'Register'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed px-4 pt-4">
              By enrolling, you agree to our <Link href="/pages/terms" className="text-burgundy hover:underline">Strategic Terms</Link> and <Link href="/pages/privacy" className="text-burgundy hover:underline">Surveillance Policy</Link>
            </p>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-200 text-center">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              Already Identified?{" "}
              <Link
                href="/auth/login"
                className="text-navy hover:text-gold transition-colors ml-1"
              >
                Return to Gateway
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}