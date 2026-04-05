"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI, paymentAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor, getAssetUrl } from '@/lib/utils';
import PriceDisplay from '@/components/common/PriceDisplay';
import { DetailSkeleton } from "@/components/common/Skeletons";
import toast from 'react-hot-toast';
import { 
  Package, Truck, CreditCard, FileText, MapPin, CheckCircle, 
  ShieldCheck, Clock, Download, ChevronLeft, ExternalLink, 
  Award, Box, Info, Globe, AlertCircle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndVerifyData = async () => {
      setIsLoading(true);
      try {
        const id = params.id as string;
        const res = await orderAPI.getById(id);
        let fetchedOrder = res.data.data;

        // Stripe Redirect Interceptor Pipeline
        const paymentIntent = searchParams.get('payment_intent');
        const redirectStatus = searchParams.get('redirect_status');
        
        if (paymentIntent && redirectStatus === 'succeeded' && fetchedOrder.paymentStatus !== 'paid') {
           try {
              // Force Server confirmation ignoring webhook
              await paymentAPI.confirmPayment(id, paymentIntent);
              const updated = await orderAPI.getById(id);
              fetchedOrder = updated.data.data;
              toast.success("Payment instantly verified.");
           } catch (error) {
              console.error("Payment sync failed:", error);
           }
        }
        
        setOrder(fetchedOrder);
      } catch (err) {
        toast.error("Failed to load dossier.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndVerifyData();
  }, [params.id, searchParams]);

  if (isLoading) return <DetailSkeleton />;
  if (!order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-16 w-16 text-burgundy/20 mb-6" />
      <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Dossier Not Found</h2>
      <button onClick={() => router.back()} className="mt-6 text-burgundy font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:-translate-x-1 transition-transform">
        <ChevronLeft className="h-4 w-4" /> Return to Vault
      </button>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-200">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-burgundy transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Acquisitions
          </button>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 bg-gold rounded-full" />
             <span className="text-sm font-black text-gold uppercase tracking-[0.1em]">Official Acquisition Dossier</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Asset <span className="text-burgundy font-serif italic lowercase">{order.orderNumber}</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <button className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl text-sm font-black text-navy uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-xl shadow-black/[0.02]">
              <Download className="h-4 w-4" /> Export Invoice
           </button>
           <button className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-2xl text-sm font-black text-navy uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20">
              <Award className="h-4 w-4 text-gold" /> Authenticity Paper
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Asset Spotlight */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.02] border border-gray-200 overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-80 h-80 bg-navy/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
             <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="w-48 h-48 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-inner group-hover:scale-105 transition-transform duration-1000">
                   {order.lot?.images?.[0]?.url ? (
                      <img src={getAssetUrl(order.lot.images[0].url)} className="w-full h-full object-cover" alt={order.lot.title} />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200"><Box className="h-12 w-12" /></div>
                   )}
                </div>
                <div className="flex-1 space-y-6">
                   <div>
                      <span className="text-sm font-black text-burgundy uppercase tracking-widest mb-2 block">{order.lot?.category?.name || 'Curated Collectible'}</span>
                      <h2 className="text-3xl font-black text-navy uppercase tracking-tight leading-tight">{order.lot?.title || 'Anonymous Masterpiece'}</h2>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Lot Number</p>
                         <p className="text-base font-black text-navy">#{(order.lot?.lotNumber || '000').toString().padStart(3, '0')}</p>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Maison Origin</p>
                         <p className="text-base font-black text-navy italic font-serif capitalize">{order.lot?.seller?.companyName || 'Private Collection'}</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Invoicing Strategic Breakdown */}
          <motion.div variants={itemVariants} className="bg-navy rounded-xl p-10 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-burgundy/10 rounded-full blur-3xl" />
             <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 mb-10">
                <FileText className="h-6 w-6 text-gold" /> Settlement <span className="text-white/30 italic font-serif lowercase">Structure</span>
             </h3>
             <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center py-4 border-b border-white/10 group">
                   <span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Hammer Price</span>
                   <PriceDisplay amount={order.hammerPrice} size="lg" variant="white" align="right" />
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/10 group">
                   <div>
                      <span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Buyer&apos;s Premium</span>
                      <span className="ml-3 text-sm bg-white/10 px-2 py-0.5 rounded-md font-black">RATE: {order.buyersPremiumRate}%</span>
                   </div>
                   <PriceDisplay amount={order.buyersPremium} size="lg" variant="white" align="right" />
                </div>
                {order.insuranceEnabled && (
                  <div className="flex justify-between items-center py-4 border-b border-white/10 group">
                     <span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Asset Protection Insurance</span>
                     <PriceDisplay amount={order.hammerPrice * 0.01} size="lg" variant="white" align="right" />
                  </div>
                )}
                <div className="flex justify-between items-center py-4 border-b border-white/10 group">
                   <span className="text-sm font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Strategic Logistics</span>
                   <PriceDisplay amount={order.shippingCost || 0} size="lg" variant="white" align="right" />
                </div>
                
                <div className="flex justify-between items-center pt-8 min-w-0">
                    <div className="shrink-0 mr-4">
                       <p className="text-sm font-black text-gold uppercase tracking-[0.1em] mb-1">Aggregated Settlement</p>
                       <p className="text-4xl font-black text-white tracking-tighter uppercase">Total Paid</p>
                    </div>
                    <div className="text-right min-w-0 flex-1 overflow-hidden">
                       <PriceDisplay amount={order.totalAmount} size="5xl" variant="gold" align="right" />
                       <div className="inline-flex items-center gap-2 mt-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full whitespace-nowrap">
                          <ShieldCheck className="h-3 w-3 text-green-500" />
                          <span className="text-sm font-black uppercase tracking-widest text-white/70">Verified Transaction</span>
                       </div>
                    </div>
                 </div>
             </div>
          </motion.div>

          {/* Logistics Pathway */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-10 shadow-2xl shadow-black/[0.02] border border-gray-200">
             <h3 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3 mb-10">
                <Truck className="h-6 w-6 text-gold" /> Logistics <span className="text-gray-300 italic font-serif lowercase">Pathway</span>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Horizontal Connection Line */}
                <div className="hidden md:block absolute top-[1.75rem] left-10 right-10 h-0.5 bg-gray-100 -z-0" />
                
                {[
                  { label: 'Settlement confirmed', status: 'completed', icon: CreditCard },
                  { label: 'Asset Preparation', status: order.shippingStatus !== 'pending' ? 'completed' : 'active', icon: Package },
                  { label: 'In Transit', status: ['shipped', 'delivered'].includes(order.shippingStatus) ? 'completed' : order.shippingStatus === 'processing' ? 'active' : 'pending', icon: Globe },
                  { label: 'Final Delivery', status: order.shippingStatus === 'delivered' ? 'completed' : 'pending', icon: MapPin }
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center">
                     <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-700 ${step.status === 'completed' ? 'bg-navy text-gold shadow-lg shadow-navy/20' : step.status === 'active' ? 'bg-gold text-navy animate-pulse' : 'bg-gray-50 text-gray-200'}`}>
                        <step.icon className="h-6 w-6" />
                     </div>
                     <p className={`text-sm font-black uppercase tracking-widest ${step.status === 'pending' ? 'text-gray-300' : 'text-navy'}`}>{step.label}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Sidebar Intelligence */}
        <div className="lg:col-span-4 space-y-8">
           {/* Status Capsule */}
           <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.02] border border-gray-200">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Execution Status</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-sm font-black text-navy uppercase tracking-widest">Transaction</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg uppercase tracking-widest ${getOrderStatusColor(order.paymentStatus)}`}>
                       {order.paymentStatus}
                    </span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-sm font-black text-navy uppercase tracking-widest">Logistics</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg uppercase tracking-widest ${getOrderStatusColor(order.shippingStatus)}`}>
                       {order.shippingStatus}
                    </span>
                 </div>
              </div>
              {order.paymentStatus === 'pending' && (
                 <Link href={`/checkout/${order._id}`} className="mt-8 btn-primary w-full py-4 text-sm tracking-[0.1em]">Finalize Settlement</Link>
              )}
           </motion.div>

           {/* Shipping Intelligence */}
           <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.02] border border-gray-200">
              <h4 className="text-base font-black text-navy uppercase tracking-tight flex items-center gap-2 mb-6">
                 <MapPin className="h-4 w-4 text-burgundy" /> Delivery Destination
              </h4>
              <div className="space-y-4">
                 <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Residential Vault</p>
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-navy uppercase">{order.shippingAddress?.street}</p>
                       <p className="text-sm font-bold text-navy uppercase">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                       <p className="text-sm font-black text-navy/40 uppercase tracking-widest mt-2">{order.shippingAddress?.country || 'Global Citizen'}</p>
                    </div>
                 </div>
                 {order.trackingNumber && (
                    <div className="flex items-center justify-between p-4 bg-navy text-white rounded-2xl group cursor-pointer">
                       <div>
                          <p className="text-sm font-black text-white/40 uppercase tracking-widest">Tracking Manifest</p>
                          <p className="text-sm font-black">{order.trackingNumber}</p>
                       </div>
                       <ExternalLink className="h-4 w-4 text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                 )}
              </div>
           </motion.div>

           {/* Verification Capsule */}
           <motion.div variants={itemVariants} className="bg-burgundy rounded-xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                 <ShieldCheck className="h-20 w-20" />
              </div>
              <h4 className="text-base font-black uppercase tracking-tight mb-4 flex items-center gap-2 relative z-10">
                 <Award className="h-4 w-4 text-gold" /> Provenance Shield
              </h4>
              <p className="text-sm leading-relaxed text-white/70 italic font-serif relative z-10">This asset has been processed through the Augeo Strategic Authentication protocol. All ownership records are encrypted and stored in the global archive.</p>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}