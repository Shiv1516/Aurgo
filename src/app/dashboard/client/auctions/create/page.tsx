"use client";
import { useState, useEffect } from "react";
import { clientAPI, categoryAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Calendar, DollarSign, Image as ImageIcon, ArrowRight, ArrowLeft, CheckCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.8 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export default function CreateAuctionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startTime: "",
    endTime: "",
    coverImage: "",
    location: "Global Showcase",
  });

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await clientAPI.createAuction(formData);
      toast.success("Protocol Initiated: Boutique launched successfully");
      router.push(`/dashboard/client/auctions/${res.data.data._id}/edit`);
    } catch (error) {
      toast.error("Operation Failed: Authorization error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-12 py-10 pb-32"
    >
      <div className="flex flex-col items-center text-center space-y-4">
         <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-burgundy" />
            <span className="text-sm font-black text-burgundy uppercase tracking-[0.4em]">Curation Protocol Phase {(step.toString().padStart(2, '0'))}</span>
         </div>
         <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">Initiate <span className="text-gold italic font-serif normal-case">Sale</span></h1>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between relative px-8">
        <div className="absolute top-1/2 left-8 right-8 h-px bg-gray-100 -z-10" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-14 h-14 rounded-[1.2rem] flex flex-col items-center justify-center font-black text-sm transition-all duration-700 relative z-10 ${
              step >= s ? 'bg-navy text-gold shadow-2xl shadow-navy/20' : 'bg-white text-gray-300 border border-gray-100'
            }`}
          >
            {step > s ? <CheckCircle className="h-6 w-6 text-gold" /> : <span className={`text-xl ${step === s ? 'text-gold' : ''}`}>{s}</span>}
            {step === s && (
              <motion.div layoutId="stepMarker" className="absolute -inset-1 border-2 border-gold rounded-[1.4rem]" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] p-16 shadow-2xl shadow-black/[0.03] border border-gray-50 relative overflow-hidden min-h-[500px] flex flex-col">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Sparkles className="h-64 w-64 text-navy rotate-12" />
        </div>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-navy uppercase tracking-tight">Identity & Concept</h2>
                  <p className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] mt-2">Foundational Intelligence for your Strategic Showcase</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-navy/40 uppercase tracking-widest ml-1">Collection Nomination (Title)</label>
                    <input 
                      type="text" 
                      className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                      placeholder="e.g. THE ROYAL HERITAGE SUITE"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-navy/40 uppercase tracking-widest ml-1">Genesis Narrative (Description)</label>
                    <textarea 
                      rows={4}
                      className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                      placeholder="Describe the ethos and provenance of this collection..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-navy/40 uppercase tracking-widest ml-1">Operational Sphere (Category)</label>
                      <select 
                        className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy focus:ring-2 focus:ring-gold/20 appearance-none cursor-pointer outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Sphere</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-navy/40 uppercase tracking-widest ml-1">Physical Base</label>
                      <input 
                        type="text" 
                        className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                        placeholder="e.g. London / Global Distribution"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-navy uppercase tracking-tight">Temporal Bounds</h2>
                  <p className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] mt-2">Define the window of High-Stakes Interaction</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                       <Calendar className="h-3 w-3 text-gold" />
                       <label className="text-sm font-black text-navy/40 uppercase tracking-widest">Exhibition Launch</label>
                    </div>
                    <input 
                      type="datetime-local" 
                      className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                       <Gavel className="h-3 w-3 text-burgundy" />
                       <label className="text-sm font-black text-navy/40 uppercase tracking-widest">The Gavel Falls</label>
                    </div>
                    <input 
                      type="datetime-local" 
                      className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                      value={formData.endTime}
                      onChange={e => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-10 bg-navy rounded-[2.5rem] border border-white/5 flex items-start gap-6 shadow-2xl shadow-navy/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-all duration-1000">
                     <ShieldCheck className="h-24 w-24 text-gold" />
                  </div>
                  <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                     <Calendar className="h-6 w-6 text-gold" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Platform Protocol Reminder</p>
                    <p className="text-sm border-l-2 border-gold pl-4 text-white/50 font-bold uppercase mt-1 leading-relaxed tracking-widest">Identity verification and lot curation require a minimum 48-hour audit window prior to operational launch.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-black text-navy uppercase tracking-tight">Cinematic Finish</h2>
                  <p className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] mt-2">Visual Curation for your Vault Premier</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-navy/40 uppercase tracking-widest ml-1">Signature Asset URL (Cover Image)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
                      <input 
                        type="text" 
                        className="w-full pl-16 pr-8 py-6 bg-gray-50 border-none rounded-[1.5rem] text-base font-black text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                        placeholder="https://vault.assets.com/image.jpg"
                        value={formData.coverImage}
                        onChange={e => setFormData({...formData, coverImage: e.target.value})}
                      />
                    </div>
                  </div>

                  {formData.coverImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10 border-8 border-gray-50"
                    >
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Vault Preview" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 flex justify-between items-center gap-6">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="px-10 py-5 bg-gray-50 text-navy font-black text-sm uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-gray-100 transition-all flex items-center gap-3 border border-transparent shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Protocol Back
            </button>
          ) : <div />}
          
          <div className="flex gap-4">
             {step < 3 ? (
               <button 
                 onClick={nextStep}
                 disabled={!formData.title || !formData.category}
                 className="px-12 py-5 bg-navy text-white font-black text-sm uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-navy/20 hover:bg-gold hover:text-navy hover:-translate-y-1 transition-all disabled:opacity-30 flex items-center gap-3 group"
               >
                 Advance Sequence <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </button>
             ) : (
               <button 
                 onClick={handleSubmit}
                 disabled={isSubmitting || !formData.coverImage}
                 className="px-12 py-5 bg-burgundy text-white font-black text-sm uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-burgundy/20 hover:bg-navy hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-30 group"
               >
                 {isSubmitting ? "Initiating Protocol..." : "Launch Boutique"} <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
               </button>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
