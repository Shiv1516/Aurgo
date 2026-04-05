"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Lock, 
  Fingerprint, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    icon: UserCheck,
    title: "Primary Intake",
    desc: "Initial profiling and algorithmic cross-referencing of global watchlists and institutional databases.",
    time: "Instant",
    color: "burgundy"
  },
  {
    icon: FileText,
    title: "Document Nexus",
    desc: "Secure upload of government-issued identification and certified proof of residency.",
    time: "2-5 Minutes",
    color: "navy"
  },
  {
    icon: Fingerprint,
    title: "Biometric Audit",
    desc: "AI-driven liveness detection and visual mapping to ensure zero-risk identity confirmation.",
    time: "Real-time",
    color: "burgundy"
  },
  {
    icon: ShieldCheck,
    title: "Executive Review",
    desc: "Final manual clearance by our security council for high-limit bidding privileges.",
    time: "12-24 Hours",
    color: "navy"
  }
];

export default function AuthenticationProcess() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayDuration = 5000;
  const progressRef = useRef(null);

  const nextStep = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % STEPS.length);
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextStep, autoPlayDuration);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextStep]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)"
    }),
  };

  const Icon = STEPS[currentIndex].icon;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-burgundy/10">
      {/* Header Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-burgundy/5 blur-[120px] rounded-full translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-navy/5 blur-[100px] rounded-full -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-burgundy text-sm font-black uppercase tracking-[0.5em] mb-6"
          >
            <div className="h-px w-8 bg-burgundy/30" />
            <Lock className="h-3 w-3" /> Secure Protocol
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-dark tracking-tighter uppercase leading-[0.85] mb-8"
          >
            Trust <span className="text-burgundy italic">Clearance</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-2xl font-medium max-w-3xl italic leading-relaxed"
          >
            Excellence in verification. Our multi-layer algorithmic vault ensures absolute integrity for every participant in the Augeo heritage ecosystem.
          </motion.p>
        </div>
      </section>

      {/* Slider Section */}
      <section className="py-32 overflow-hidden relative" 
               onMouseEnter={() => setIsAutoPlaying(false)}
               onMouseLeave={() => setIsAutoPlaying(true)}>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-burgundy/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-navy/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="relative min-h-[600px] flex items-center justify-center">
            
            {/* Professional Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center z-30 pointer-events-none">
              <motion.button 
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevStep}
                className="pointer-events-auto p-6 rounded-full border border-gray-200 bg-white/90 backdrop-blur-md text-dark hover:border-gold hover:text-gold transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.05)] ml-[-20px] lg:ml-[-40px]"
              >
                <ChevronLeft className="h-8 w-8" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextStep}
                className="pointer-events-auto p-6 rounded-full border border-gray-200 bg-white/90 backdrop-blur-md text-dark hover:border-gold hover:text-gold transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.05)] mr-[-20px] lg:mr-[-40px]"
              >
                <ChevronRight className="h-8 w-8" />
              </motion.button>
            </div>

            {/* Main Slider Content */}
            <div className="w-full max-w-5xl h-full relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 200, damping: 25 },
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 }
                  }}
                  className="w-full"
                >
                  <div className="relative bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.08)] group">
                    
                    {/* Synchronized Progress Bar */}
                    {isAutoPlaying && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 z-40">
                         <motion.div 
                           key={`progress-${currentIndex}`}
                           initial={{ width: "0%" }}
                           animate={{ width: "100%" }}
                           transition={{ duration: autoPlayDuration / 1000, ease: "linear" }}
                           className="h-full bg-burgundy"
                         />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 items-center">
                      {/* Left: Animated Icon Section */}
                      <div className="p-8 md:p-24 bg-dark flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,16,28,0.2)_0%,transparent_70%)]" />
                        
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="relative z-10"
                        >
                          <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-2xl relative shadow-2xl">
                             <motion.div
                               animate={{ 
                                 y: [0, -10, 0],
                                 rotate: [0, 5, 0]
                               }}
                               transition={{ 
                                 duration: 4, 
                                 repeat: Infinity, 
                                 ease: "easeInOut" 
                               }}
                             >
                                <Icon className="h-24 w-24 text-burgundy drop-shadow-[0_0_20px_rgba(128,16,28,0.5)]" />
                             </motion.div>
                          </div>
                          
                          {/* Floating Accents */}
                          <motion.div 
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-6 -right-6 w-12 h-12 bg-burgundy/20 rounded-2xl blur-xl"
                          />
                        </motion.div>

                        <div className="mt-12 text-center relative z-10">
                           <span className="inline-block px-6 py-2 bg-burgundy text-white text-sm font-black uppercase tracking-[0.1em] rounded-full mb-4">
                             Protocol Layer 0{currentIndex + 1}
                           </span>
                           <h4 className="text-white/40 font-black uppercase text-sm tracking-widest">Clearance Level Silver</h4>
                        </div>
                      </div>

                      {/* Right: Content Section */}
                      <div className="p-8 md:p-24">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center gap-3 mb-8">
                             <Activity className="h-5 w-5 text-burgundy animate-pulse" />
                             <span className="text-sm font-black text-burgundy uppercase tracking-widest">Active Verification Step</span>
                          </div>
                          
                          <h3 className="text-5xl font-black text-dark mb-8 uppercase tracking-tighter leading-none">
                            {STEPS[currentIndex].title}
                          </h3>
                          
                          <p className="text-gray-500 text-xl font-medium leading-relaxed mb-12">
                            {STEPS[currentIndex].desc}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                            <div>
                               <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Network Latency</p>
                               <div className="flex items-end gap-2">
                                  <span className="text-3xl font-black text-dark tracking-tight">{STEPS[currentIndex].time}</span>
                               </div>
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Security Status</p>
                               <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                                  <span className="text-sm font-black text-dark uppercase tracking-widest">Shielded</span>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Premium Pagination Dots */}
          <div className="flex justify-center items-center gap-6 mt-16">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className="group relative flex items-center justify-center p-2"
              >
                <div className={`absolute -inset-2 rounded-full border border-burgundy/20 transition-all duration-500 ${
                  i === currentIndex ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`} />
                <div className={`transition-all duration-500 rounded-full h-2 ${
                  i === currentIndex ? "w-16 bg-burgundy" : "w-3 bg-gray-200 group-hover:bg-gray-400"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Security Infrastructure - Premium Treatment */}
      <section className="py-32 bg-dark text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(128,16,28,0.1)_0%,transparent_50%)]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20" />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-12 w-12 rounded-2xl bg-burgundy flex items-center justify-center shadow-lg shadow-burgundy/20">
                        <Lock className="h-6 w-6 text-dark" />
                     </div>
                     <span className="text-burgundy font-black uppercase tracking-[0.1em] text-sm">Augeo Shield™</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-10 leading-none">
                    Institutional <span className="text-burgundy italic">Protocol</span>
                  </h2>
                  
                  <div className="space-y-8">
                    {[
                      { label: "Encryption", val: "AES-256 Bit End-to-End verified packets." },
                      { label: "Privacy", val: "Zero-Knowledge Proof (ZKP) secure protocols." },
                      { label: "Mitigation", val: "Advanced DDoS & Bot Layer-7 Mitigation." },
                      { label: "Monitoring", val: "24/7 Certified Security Council observation." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-start gap-6 p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all"
                      >
                        <div className="mt-1 h-3 w-3 rounded-full bg-burgundy group-hover:scale-150 transition-transform" />
                        <div>
                           <p className="text-burgundy font-black uppercase text-sm tracking-widest mb-1">{item.label}</p>
                           <p className="text-gray-400 font-medium text-lg">{item.val}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
               </div>
               
               <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl relative z-10 text-center"
                  >
                     <div className="relative mb-12 inline-block">
                        <ShieldAlert className="h-48 w-48 text-burgundy opacity-20 mx-auto" />
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                           <ShieldCheck className="h-24 w-24 text-burgundy" />
                        </motion.div>
                     </div>
                     
                     <p className="text-burgundy font-black uppercase tracking-[0.5em] text-sm mb-4">Integrity Guarantee</p>
                     <h3 className="text-4xl font-black uppercase tracking-tight mb-6">Zero-Leach Infrastructure</h3>
                     <p className="text-gray-500 font-medium max-w-sm mx-auto">
                        Your data is never stored in plaintext and remains isolated from the public internet nodes.
                     </p>
                  </motion.div>
                  
                  {/* Decorative orbital */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section - High Impact */}
      <section className="py-40 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-dark tracking-tighter uppercase mb-10 leading-none">
              Ready for <span className="text-burgundy italic text-7xl md:text-9xl">Clearance?</span>
            </h2>
            <p className="text-gray-500 text-2xl mb-16 font-medium italic max-w-2xl mx-auto leading-relaxed">
              Achieve verified institutional status in approximately 12 minutes. The gateway to Augeo is now open.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <Link href="/dashboard/profile" className="group relative px-16 py-6 bg-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden">
                <div className="absolute inset-0 bg-burgundy translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Begin Verification</span>
              </Link>
              <Link href="/info/how-it-works" className="px-12 py-6 border border-gray-200 hover:border-burgundy rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-gray-50">
                 View Bidding Rules
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


