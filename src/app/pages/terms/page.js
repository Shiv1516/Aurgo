"use client";

import Link from "next/link";
import { Scale, FileText, ShieldAlert, CheckCircle2, ChevronRight, Lock } from "lucide-react";

export default function Term() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-burgundy/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-burgundy text-sm font-black uppercase tracking-[0.4em] mb-4">
            <Scale className="h-3 w-3" /> Legal Framework
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter uppercase leading-none mb-6">
            Terms of <span className="text-burgundy italic">Engagement</span>
          </h1>
          <p className="text-gray-500 text-2xl font-medium max-w-2xl italic leading-relaxed">
            The contractual architecture governing participation within the Augeo global auction ecosystem.
          </p>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mt-8">Last Updated: February 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Nav Sidebar */}
            <div className="hidden lg:block space-y-4 sticky top-32 h-fit">
               <p className="text-sm font-black text-burgundy uppercase tracking-widest mb-6">Agreement Indices</p>
               {[
                 "Guild Membership",
                 "Bidding Sovereignty",
                 "Financial Settlement",
                 "Intellectual Property",
                 "Dispute Resolution"
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-burgundy/5 transition-colors cursor-pointer group">
                    <span className="text-sm font-bold text-dark">{item}</span>
                    <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-burgundy" />
                 </div>
               ))}
               <div className="pt-8 text-center bg-dark rounded-3xl p-6 text-white">
                  <Lock className="h-8 w-8 text-burgundy mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest mb-2">Secure Agreement</p>
                  <p className="text-sm text-gray-400 italic">By using this platform, you agree to these protocols.</p>
               </div>
            </div>

            {/* Legal Text */}
            <div className="lg:col-span-3 space-y-16">
               <article className="prose prose-burgundy max-w-none">
                  <div className="space-y-8">
                     <section>
                        <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-4 flex items-center gap-3">
                           <div className="h-6 w-1 bg-burgundy rounded-full" /> 1. Guild Membership & Eligibility
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-4">
                          Membership to the Augeo platform is a privilege, not a right. All users must maintain "Active" status through our Trust Clearance protocol. We reserve the right to revoke access to any participant who fails to meet our professional conduct standards or financial commitments.
                        </p>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          Participants must be at least 18 years of age and possess the legal capacity to enter into binding financial contracts within their primary jurisdiction.
                        </p>
                     </section>

                     <section>
                        <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-4 flex items-center gap-3">
                           <div className="h-6 w-1 bg-burgundy rounded-full" /> 2. Bidding Sovereignty
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-4">
                          A bid constitutes a legally binding contract to purchase the asset at the specified "Hammer Price" plus all applicable premiums and logistics surcharges. Once a bid is registered in our real-time socket infrastructure, it cannot be withdrawn except under specific conditions verified by our Council.
                        </p>
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                           <ShieldAlert className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                           <p className="text-sm text-red-600 font-bold leading-relaxed italic">
                             Warning: Failed commitments resulting from "bid negligence" will result in a permanent ban from the guild and potential legal action to recover lost premiums.
                           </p>
                        </div>
                     </section>

                     <section>
                        <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-4 flex items-center gap-3">
                           <div className="h-6 w-1 bg-burgundy rounded-full" /> 3. Financial Settlement
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          All winning bids must be settled within 72 hours of the auction close. Payments are processed through our secure gateway (Stripe Capital). Assets will only enter the Logistics Nexus once funds have reached full "Settled" status in our accounts.
                        </p>
                     </section>

                     <section>
                        <h2 className="text-3xl font-black text-dark uppercase tracking-tight mb-4 flex items-center gap-3">
                           <div className="h-6 w-1 bg-burgundy rounded-full" /> 4. Intellectual Property
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          All imagery, visual classification data, and technical protocols present on Augeo are the exclusive property of the Guild. Unauthorized reproduction or algorithmic scraping of our catalog data is strictly prohibited.
                        </p>
                     </section>
                  </div>
               </article>

               <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                  <div>
                    <h3 className="text-2xl font-black text-dark uppercase mb-2 leading-none">Questions of <span className="text-burgundy italic">Law?</span></h3>
                    <p className="text-gray-400 font-medium text-base italic">Our legal council is available for clarification on complex jurisdictional issues.</p>
                  </div>
                  <Link href="/pages/contact" className="btn-primary !px-10 !py-4 uppercase tracking-widest font-black text-sm">
                     Contact Legal Desk
                  </Link>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
