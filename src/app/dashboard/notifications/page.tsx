"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { timeAgo } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { 
  Bell, Check, CheckCheck, Gavel, DollarSign, Truck, 
  AlertTriangle, Trophy, Zap, ShieldCheck, ArrowRight,
  Info, Mail, Box, Activity
} from 'lucide-react';
import { ListSkeleton } from '@/components/common/Skeletons';

const typeIcons: Record<string, any> = { 
  outbid: AlertTriangle, 
  auction_won: Trophy, 
  bid_placed: Gavel, 
  payment_confirmed: ShieldCheck, 
  shipment_dispatched: Truck,
  info: Info,
  security: Zap
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  if (isLoading) return (
    <div className="space-y-12">
      <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-2xl" />
      <ListSkeleton count={8} />
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="w-1.5 h-1.5 bg-burgundy rounded-full animate-ping" />
             <span className="text-sm font-black text-burgundy uppercase tracking-[0.1em]">Strategic Pulse</span>
          </div>
          <h1 className="text-5xl font-black text-navy tracking-tighter uppercase leading-none">
            Intelligence <span className="text-gold italic font-serif lowercase">Briefing</span>
          </h1>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead} 
            className="group flex items-center gap-3 text-sm font-black text-navy/40 uppercase tracking-[0.1em] hover:text-burgundy transition-colors active:scale-95"
          >
            <CheckCheck className="h-4 w-4 transition-transform group-hover:scale-110" /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-24 text-center border border-dashed border-gray-200">
          <div className="h-24 w-24 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-inner relative">
             <Bell className="h-10 w-10 text-gray-200" />
             <div className="absolute inset-0 bg-gold/5 rounded-full blur-xl scale-150" />
          </div>
          <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2">Clear Signal</h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.1em]">No strategic updates detected at this moment</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {notifications.map(n => {
              const Icon = typeIcons[n.type] || Bell;
              const isUrgent = n.priority === 'urgent' || n.priority === 'high';
              
              return (
                <motion.div 
                  key={n._id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, x: 20 }}
                  className={`group relative bg-white rounded-xl p-8 shadow-2xl shadow-black/[0.02] border transition-all duration-500 overflow-hidden ${
                    !n.isRead ? 'border-burgundy/20 hover:border-burgundy shadow-burgundy/[0.01]' : 'border-gray-200 hover:border-navy/20'
                  }`}
                >
                  {/* Decorative Gradient Background */}
                  {!n.isRead && <div className="absolute top-0 right-0 w-32 h-32 bg-burgundy/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-burgundy/10 transition-all duration-700" />}
                  
                  <div className="relative z-10 flex gap-10 items-start">
                    {/* Icon Strategy */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 shadow-xl ${
                      isUrgent ? 'bg-burgundy text-white shadow-burgundy/20 group-hover:scale-110' : 
                      !n.isRead ? 'bg-navy text-gold shadow-navy/20' : 
                      'bg-gray-50 text-gray-300'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content Matrix */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <p className={`text-lg font-black uppercase tracking-tight ${!n.isRead ? 'text-navy' : 'text-gray-500'}`}>{n.title}</p>
                             {!n.isRead && <span className="w-1.5 h-1.5 bg-gold rounded-full" />}
                             {isUrgent && <span className="text-sm font-black bg-burgundy/10 text-burgundy px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">Urgent Intervention</span>}
                          </div>
                          <p className={`text-base leading-relaxed max-w-2xl ${!n.isRead ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{n.message}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3 shrink-0">
                           <span className="text-sm font-black text-gray-300 uppercase tracking-widest">{timeAgo(n.createdAt)}</span>
                           {!n.isRead && (
                             <button 
                               onClick={() => markAsRead(n._id)} 
                               className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:text-burgundy hover:border-burgundy hover:bg-burgundy/5 transition-all active:scale-90"
                               title="Archive"
                             >
                               <Check className="h-4 w-4" />
                             </button>
                           )}
                        </div>
                      </div>

                      {n.actionUrl && (
                        <div className="pt-2">
                           <Link 
                             href={n.actionUrl} 
                             className="inline-flex items-center gap-2 text-sm font-black text-navy uppercase tracking-widest hover:text-burgundy hover:translate-x-1 transition-all"
                           >
                             Execute Action <ArrowRight className="h-3.5 w-3.5" />
                           </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Strategic Footer */}
      <div className="bg-navy rounded-xl p-8 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Activity className="h-48 w-48" />
         </div>
         <div className="relative z-10">
            <h4 className="text-3xl font-black uppercase tracking-tight mb-4">Transmission Protocol</h4>
            <p className="max-w-2xl text-sm font-bold text-white/40 uppercase tracking-[0.1em] leading-relaxed">
               All intelligence transmissions are encrypted end-to-end and stored in your private vault for 90 days. For critical intervention, ensure your email dispatch is enabled in security settings.
            </p>
         </div>
      </div>
    </motion.div>
  );
}