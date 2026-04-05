"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '@/lib/api';
import { formatCurrency, formatDate, getOrderStatusColor, getAssetUrl } from '@/lib/utils';
import PriceDisplay from '@/components/common/PriceDisplay';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { 
  Package, Eye, ArrowRight, ExternalLink, CreditCard, Truck, 
  ShieldCheck, Clock, CheckCircle2, AlertCircle, ChevronRight,
  TrendingUp, Globe, Box
} from 'lucide-react';
import { ListSkeleton } from '@/components/common/Skeletons';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 50 }).then(res => setOrders(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="space-y-12">
      <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-2xl" />
      <ListSkeleton count={5} />
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
             <span className="text-sm font-black text-burgundy uppercase tracking-[0.1em]">Logistics & Provenance</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">Acquisition <span className="text-gold italic font-serif lowercase">Collection</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-3 shadow-xl shadow-black/[0.02]">
           <div className="text-right border-r border-gray-200 pr-6">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Assets</p>
              <p className="text-xl font-black text-navy">{orders.length.toString().padStart(2, '0')}</p>
           </div>
           <div className="text-right">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Payout</p>
              <PriceDisplay amount={orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)} size="xl" variant="burgundy" align="right" />
           </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 py-32 text-center">
            <div className="h-24 w-24 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Package className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Vault Empty</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.1em]">Initiate your first acquisition to begin your collection</p>
            <Link href="/search" className="inline-flex items-center gap-2 mt-8 text-burgundy font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform">
               Explore Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order: any) => (
              <motion.div 
                key={order._id}
                variants={itemVariants}
                className="group bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.02] border border-gray-200 hover:border-gold transition-all duration-500 overflow-hidden relative"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-gold/10 transition-all duration-700" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                   {/* Order Identity */}
                   <div className="lg:col-span-3">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="h-10 w-10 bg-navy rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-navy/10">
                            <Box className="h-5 w-5 text-gold" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{order.orderNumber}</p>
                            <p className="text-base font-black text-navy uppercase tracking-tight">{formatDate(order.createdAt)}</p>
                         </div>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-black text-navy/40 uppercase tracking-widest">
                         <Globe className="h-3 w-3" /> Global Distribution
                      </div>
                   </div>

                   {/* Asset Preview */}
                   <div className="lg:col-span-4 flex items-center gap-6">
                      <div className="h-20 w-20 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 shadow-inner">
                         {order.lot?.images?.[0]?.url ? (
                            <img 
                              src={getAssetUrl(order.lot.images[0].url)} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                              alt={order.lot.title}
                            />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                               <Package className="h-8 w-8" />
                            </div>
                         )}
                      </div>
                      <div>
                         <p className="text-lg font-black text-navy uppercase tracking-tight line-clamp-1">{order.lot?.title || 'Anonymous Asset'}</p>
                         <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-bold text-gray-400 uppercase">Acquisition Value:</span>
                            <PriceDisplay amount={order.totalAmount} size="base" variant="burgundy" align="left" />
                         </div>
                      </div>
                   </div>

                   {/* Logistics Status */}
                   <div className="lg:col-span-3 space-y-3">
                      <div className={`flex items-center justify-between p-3 rounded-2xl border ${order.paymentStatus === 'paid' ? 'bg-green-50/50 border-green-100 text-green-700' : 'bg-rose-50 border-rose-100 text-burgundy'}`}>
                         <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5" />
                            <span className="text-sm font-black uppercase tracking-widest">Payment</span>
                         </div>
                         <span className="text-sm font-black uppercase tracking-widest">{order.paymentStatus}</span>
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-2xl border ${order.shippingStatus === 'delivered' ? 'bg-navy/5 border-navy/10 text-navy' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                         <div className="flex items-center gap-2">
                            <Truck className="h-3.5 w-3.5" />
                            <span className="text-sm font-black uppercase tracking-widest">Logistics</span>
                         </div>
                         <span className="text-sm font-black uppercase tracking-widest">{order.shippingStatus}</span>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="lg:col-span-2 flex flex-col gap-3">
                      <Link 
                        href={`/dashboard/orders/${order._id}`}
                        className="flex items-center justify-center gap-2 bg-navy text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/5"
                      >
                         Dossier <ChevronRight className="h-4 w-4" />
                      </Link>
                      {order.paymentStatus === 'pending' && (
                        <Link 
                          href={`/checkout/${order._id}`}
                          className="flex items-center justify-center gap-2 bg-burgundy text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-navy transition-all shadow-xl shadow-burgundy/10"
                        >
                           Finalize Settlement
                        </Link>
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Signifiers Footer */}
      <div className="bg-navy rounded-xl p-8 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white rounded-full scale-150" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-white rounded-full scale-150" />
         </div>
         <ShieldCheck className="h-12 w-12 text-gold mx-auto mb-6" />
         <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Guaranteed Provenance</h4>
         <p className="text-sm font-bold text-white/40 uppercase tracking-[0.1em] max-w-xl mx-auto leading-relaxed">Every acquisition within the Augeo Vault is protected by our strategic audit protocol and verified by the world's leading valuation maisons.</p>
      </div>
    </motion.div>
  );
}