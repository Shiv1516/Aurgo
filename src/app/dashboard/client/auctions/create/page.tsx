"use client";
import { useState, useEffect } from "react";
import { clientAPI, categoryAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Gavel, Calendar, DollarSign, Image as ImageIcon, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.success("Boutique created successfully");
      router.push(`/dashboard/client/auctions/${res.data.data._id}/edit`);
    } catch (error) {
      toast.error("Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-10" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 scale-125 ${
              step >= s ? 'bg-gold text-white shadow-xl shadow-gold/20' : 'bg-white text-gray-300 border border-gray-100'
            }`}
          >
            {step > s ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-black/[0.03] border border-white">
        {step === 1 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black text-dark uppercase tracking-tight">Identity & Concept</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Foundational Intelligence for your Boutique</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Collection Title</label>
                <input 
                  type="text" 
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                  placeholder="e.g. THE GENESIS COLLECTION"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Genesis Narrative (Description)</label>
                <textarea 
                  rows={4}
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                  placeholder="Describe the ethos of this collection..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Market Category</label>
                  <select 
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Sphere</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Base</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                    placeholder="e.g. London, UK"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black text-dark uppercase tracking-tight">Temporal Bounds</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Define the window of high-stakes interaction</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Exhibition Start (Date & Time)</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Gavel Falls (End Date & Time)</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
              <Calendar className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Protocol Reminder</p>
                <p className="text-[10px] text-amber-600 font-bold uppercase mt-1 leading-relaxed">Ensure a minimum 7-day marketing window for optimal engagement and platform spotlight prioritization.</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black text-dark uppercase tracking-tight">Cinematic Finish</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Visual Curation for your Platform Debut</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Signature Asset URL (Cover Image)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold transition-all"
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  />
                </div>
              </div>

              {formData.coverImage && (
                <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 border-4 border-white">
                  <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between gap-4">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="px-8 py-5 bg-gray-50 text-dark font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Protocol Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              disabled={!formData.title || !formData.category}
              className="px-10 py-5 bg-dark text-gold font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gold/10 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              Finalize Sequence <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.coverImage}
              className="px-10 py-5 bg-gold text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gold/20 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              {isSubmitting ? "Initiating..." : "Launch Boutique"} <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
