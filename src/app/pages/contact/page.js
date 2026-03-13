"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", inquiry: "Technical Acquisition Issue", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message dispatched successfully");
  };

  if (isSubmitted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="h-24 w-24 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-burgundy" />
           </div>
           <h2 className="text-5xl font-black text-dark tracking-tighter uppercase">Transmission <span className="text-burgundy">Received</span></h2>
           <p className="text-gray-500 font-medium italic leading-relaxed">
             Your communiqué has been securely logged within our executive nexus. A concierge specialist will initiate contact within the hour.
           </p>
           <button 
             onClick={() => setIsSubmitted(false)}
             className="btn-primary !px-12 uppercase tracking-widest text-sm font-black"
           >
             Return to Terminal
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-burgundy/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.4em] mb-4">
            <MessageSquare className="h-3 w-3" /> Communication Nexus
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter uppercase leading-none mb-6">
            Contact <span className="text-burgundy italic">Concierge</span>
          </h1>
          <p className="text-gray-500 text-2xl font-medium max-w-2xl italic leading-relaxed">
            Direct access to our executive support guild for tailored inquiries, logistical audit requests, and high-value acquisition management.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            
            {/* Contact Information */}
            <div className="space-y-12">
               <div>
                  <h2 className="text-4xl font-black text-dark tracking-tighter uppercase mb-8">Guild <span className="text-burgundy italic">Terminals</span></h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { icon: Mail, label: "Acquisitions", value: "vault@augeo.global", color: "bg-burgundy/10" },
                      { icon: Phone, label: "Executive Line", value: "+1 (888) AUGEO-HQ", color: "bg-dark text-burgundy" },
                      { icon: MapPin, label: "Vault Nexus", value: "New York • London • Dubai", color: "bg-gray-100" },
                      { icon: Clock, label: "Operational Hours", value: "24/7 Global Vigilance", color: "bg-burgundy/5" }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-3xl border border-gray-50 bg-white shadow-lg shadow-black/5 hover:border-burgundy/30 transition-all group">
                         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="h-6 w-6" />
                         </div>
                         <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                         <p className="font-bold text-dark">{item.value}</p>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-10 bg-dark rounded-[3rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                     <Globe className="h-40 w-40 text-burgundy" />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Global Network</h3>
                     <p className="text-gray-400 font-medium italic leading-relaxed mb-8">
                        Our decentralized support team operates across every major financial hub, ensuring localized expertise for your jurisdictional requirements.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        {["New York", "London", "Tokyo", "Dubai", "Singapore"].map((city, i) => (
                          <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-black uppercase tracking-[0.2em]">{city}</span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
               <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-black/5 relative z-10">
                  <h3 className="text-3xl font-black text-dark uppercase tracking-tight mb-8">Dispatch a <span className="text-burgundy italic">Message</span></h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                          <input 
                            type="text" 
                            required 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            placeholder="Member Name" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-burgundy focus:outline-none transition-all font-bold text-dark placeholder:text-gray-300" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Secure Email</label>
                          <input 
                            type="email" 
                            required 
                            value={form.email} 
                            onChange={e => setForm({...form, email: e.target.value})} 
                            placeholder="Communication Node" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-burgundy focus:outline-none transition-all font-bold text-dark placeholder:text-gray-300" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Vector</label>
                       <select 
                         value={form.inquiry} 
                         onChange={e => setForm({...form, inquiry: e.target.value})} 
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-burgundy focus:outline-none transition-all font-bold text-dark appearance-none"
                        >
                          <option>Technical Acquisition Issue</option>
                          <option>Logistics & Customs Audit</option>
                          <option>Identity Verification Retrieval</option>
                          <option>High-Value Private Treaty</option>
                          <option>General Guild Inquiry</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Brief</label>
                       <textarea 
                         rows="5" 
                         required 
                         value={form.message} 
                         onChange={e => setForm({...form, message: e.target.value})} 
                         placeholder="Specify your requirements or inquiry details..." 
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-burgundy focus:outline-none transition-all font-bold text-dark placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full py-5 bg-dark hover:bg-burgundy text-white hover:text-dark font-black rounded-2xl transition-all shadow-xl shadow-black/10 uppercase tracking-[0.3em] flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                       {isSubmitting ? "Transmitting..." : <>Transmit Message <Send className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                    </button>
                    <p className="text-center text-sm text-gray-400 font-bold italic">Average dispatch response time: 57 minutes</p>
                  </form>
               </div>
               
               {/* Background Accent */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[110%] bg-burgundy/5 blur-[120px] rounded-full -z-10" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
