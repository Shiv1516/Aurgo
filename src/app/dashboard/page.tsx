"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { adminAPI, clientAPI, bidAPI, orderAPI, notificationAPI } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { Gavel, Heart, Trophy, DollarSign, ArrowRight, Activity, Users, Package, TrendingUp, AlertCircle, Clock, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  if (user?.role === 'superadmin' || user?.role === 'admin') return <AdminDashboard user={user} />;
  if (user?.role === 'client') return <ClientDashboard user={user} />;
  return <UserDashboard user={user} />;
}

// --- ADMIN DASHBOARD (OPERATIONS ROOM) ---
function AdminDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    adminAPI.getDashboard().then(res => {
      setStats(res.data.data.stats);
      setRecentActivity(res.data.data.recentActivity);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Operations Room</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Global Platform Oversight • {user?.firstName}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl border border-green-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Optimal</span>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform GMV', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-gold bg-gold/5 border-gold/10' },
          { label: 'Citizen Base', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Live Auctions', value: stats?.liveAuctions || 0, icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: 'Pending KYC', value: stats?.pendingKYC || 0, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-[2rem] p-6 border shadow-xl shadow-black/[0.02] flex items-center justify-between group hover:border-gold transition-all duration-500 ${stat.color}`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-dark tracking-tighter">{stat.value}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-500">
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-black text-dark uppercase tracking-tight">Global Activity Log</h3>
            </div>
            <Link href="/dashboard/admin/logs" className="text-[10px] font-black text-gray-400 hover:text-gold uppercase tracking-widest transition-colors">Audit All</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((log: any) => (
              <div key={log._id} className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-gray-50 transition-colors group">
                <div className="h-10 w-10 bg-dark rounded-xl flex items-center justify-center text-[10px] font-bold text-gold shrink-0">
                  {log.action.split('_')[0].charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{log.user?.firstName} {log.user?.lastName} • {log.resource}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{timeAgo(log.createdAt)}</p>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="bg-dark rounded-[2.5rem] p-8 shadow-2xl shadow-gold/10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Settings className="h-32 w-32 text-gold animate-spin-slow" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">System Control</h3>
            <div className="space-y-3 relative z-10">
              <Link href="/dashboard/admin/users?role=client&status=pending" className="flex items-center justify-between p-4 bg-white/10 hover:bg-gold rounded-2xl text-white group/btn transition-all duration-300">
                <span className="text-xs font-bold uppercase tracking-widest">Client Requests</span>
                <span className="bg-rose-500 text-[10px] px-2 py-1 rounded-lg font-black">{stats?.pendingClients || 0}</span>
              </Link>
              <Link href="/dashboard/admin/kyc" className="flex items-center justify-between p-4 bg-white/10 hover:bg-gold rounded-2xl text-white group/btn transition-all duration-300">
                <span className="text-xs font-bold uppercase tracking-widest">Pending Verifications</span>
                <span className="bg-amber-500 text-[10px] px-2 py-1 rounded-lg font-black">{stats?.pendingKYC || 0}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CLIENT DASHBOARD (MISSION CONTROL) ---
function ClientDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [recentAuctions, setRecentAuctions] = useState<any[]>([]);

  useEffect(() => {
    clientAPI.getDashboard().then(res => {
      setStats(res.data.data.stats);
      setRecentAuctions(res.data.data.recentAuctions);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Mission Control</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">{user?.companyName} • Partner Boutique</p>
        </div>
        <Link href="/dashboard/client/auctions/create" className="bg-dark text-gold px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gold/10 hover:-translate-y-1 transition-transform">
          New Auction
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Sale Volume', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-gold bg-gold/5' },
          { label: 'Portfolio', value: stats?.totalAuctions || 0, icon: Gavel, color: 'text-blue-600 bg-blue-50' },
          { label: 'Live Inventory', value: stats?.activeLots || 0, icon: Package, color: 'text-rose-600 bg-rose-50' },
          { label: 'Pending Fulfillment', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-black/[0.02] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-dark tracking-tighter">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
        <h3 className="text-lg font-black text-dark uppercase tracking-tight mb-8">Active Boutique Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentAuctions.map((auction: any) => (
            <div key={auction._id} className="group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-4 shadow-xl shadow-black/5">
                <img src={auction.coverImage} alt={auction.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest mb-1">{auction.status}</span>
                  <p className="text-white text-sm font-bold line-clamp-1 uppercase">{auction.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex gap-4">
                  <div><p className="text-[10px] text-gray-400 font-bold uppercase">Lots</p><p className="text-xs font-black">{auction.totalLots}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-bold uppercase">Bids</p><p className="text-xs font-black">{auction.totalBids}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Expires</p>
                  <p className="text-xs font-black">{new Date(auction.endTime).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- USER DASHBOARD (VAULT OVERVIEW) ---
function UserDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({ activeBids: 0, wonAuctions: 0, totalSpent: 0 });
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    bidAPI.getMyBids({ limit: 5 }).then(res => {
      const bids = res.data.data && res.data.data.length > 0 ? res.data.data : [];
      setRecentBids(bids);
      setStats(prev => ({
        ...prev,
        activeBids: bids.filter((b: any) => ['active', 'winning', 'outbid'].includes(b.status)).length,
        wonAuctions: bids.filter((b: any) => b.status === 'won').length,
      }));
    }).catch(() => {});
    
    orderAPI.getMyOrders({ limit: 5 }).then(res => {
      const orders = res.data.data || [];
      setStats(prev => ({ ...prev, totalSpent: orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0) }));
    }).catch(() => {});

    notificationAPI.getAll({ limit: 5 }).then(res => {
      setNotifications(res.data.data || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Vault Overview</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Acquisitions & Portfolio • {user?.firstName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Live Bids', value: stats.activeBids, icon: Gavel, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pieces Won', value: stats.wonAuctions, icon: Trophy, color: 'text-green-600 bg-green-50' },
          { label: 'Acquisition Value', value: formatCurrency(stats.totalSpent), icon: DollarSign, color: 'text-gold bg-gold/5' },
          { label: 'Curated Watchlist', value: 0, icon: Heart, color: 'text-rose-500 bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-black/[0.02] flex items-center justify-between group hover:border-gold transition-colors duration-500">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-dark tracking-tighter">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-dark uppercase tracking-tight">Recent Bids</h3>
            <Link href="/dashboard/bids" className="text-[10px] font-black text-gold uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">History <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {recentBids.length > 0 ? (
            <div className="space-y-4">
              {recentBids.map((bid: any) => (
                <div key={bid._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-dark uppercase tracking-tight">{bid.lot?.title || 'Lot'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{bid.auction?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-dark">{formatCurrency(bid.amount)}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${bid.status === 'winning' ? 'bg-green-100 text-green-700' : bid.status === 'outbid' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'}`}>{bid.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (<p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center py-10">No bid activity</p>)}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] border border-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-dark uppercase tracking-tight">Intelligence</h3>
            <Link href="/dashboard/notifications" className="text-[10px] font-black text-gold uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">All Intel <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((n: any) => (
                <div key={n._id} className={`p-4 rounded-2xl transition-all duration-500 border border-transparent ${!n.isRead ? 'bg-gold/5 border-gold/10' : 'hover:bg-gray-50 hover:border-gray-100'}`}>
                  <p className="text-sm font-bold text-dark uppercase tracking-tight">{n.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">{n.message}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">{timeAgo(n.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (<p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center py-10">System calm</p>)}
        </div>
      </div>
    </div>
  );
}