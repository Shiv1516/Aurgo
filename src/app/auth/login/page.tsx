"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Gavel, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Identity Verified: Welcome back to the Vault");
      const user = useAuthStore.getState().user;
      const role = user?.role;

      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "client") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Access Denied: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-burgundy rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-xl w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
             <div className="h-px w-8 bg-gold/30" />
             <ShieldCheck className="h-5 w-5 text-burgundy" />
             <div className="h-px w-8 bg-gold/30" />
          </div>
          <h1 className="text-6xl font-black text-navy tracking-tighter uppercase leading-none mb-4">
            Security <span className="text-gold italic font-serif lowercase">Gateway</span>
          </h1>
          <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em]">Authorized Access Only</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.04] border border-gray-200 relative group overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/50 -z-10" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="font-black text-gray-400 uppercase ml-1">Email</label>
              <div className="relative group/field">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within/field:text-gold transition-colors" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-16 pr-8 py-6 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="name@maison.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="font-black text-gray-400 uppercase ml-1">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-black text-burgundy uppercase tracking-widest hover:text-navy transition-colors"
                >
                  Reset Password
                </Link>
              </div>
              <div className="relative group/field">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within/field:text-burgundy transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-16 pr-16 py-6 bg-gray-50 border-none rounded-xl text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-navy transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-navy text-white rounded-xl transition-all font-black text-sm uppercase tracking-[0.1em] shadow-2xl shadow-navy/20 hover:bg-gold hover:text-navy hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? "submitting..." : "Submit"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-200 text-center">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              New to the Protocol?{" "}
              <Link
                href="/auth/register"
                className="text-burgundy hover:text-navy transition-colors ml-1"
              >
                Request Enrollment
              </Link>
            </p>
          </div>
        </div>

        {/* Brand Signifier */}
        <div className="mt-12 flex items-center justify-center gap-3 opacity-20 group hover:opacity-100 transition-opacity">
           <Gavel className="h-4 w-4 text-navy" />
           <span className="text-sm font-black text-navy uppercase tracking-[0.5em]">AUGEO • VAULT</span>
        </div>
      </motion.div>
    </div>
  );
}
