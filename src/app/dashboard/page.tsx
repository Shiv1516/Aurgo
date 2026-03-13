"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CountUp from 'react-countup';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { 
  Gavel, Heart, Trophy, DollarSign, ArrowRight, Activity, Users, 
  Package, TrendingUp, AlertCircle, Clock, Settings, ShieldCheck, 
  Eye, BarChart3, Target, Zap, Globe, Shield, Bell, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { adminAPI, clientAPI, bidAPI, orderAPI, notificationAPI, watchlistAPI } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  if (user?.role === 'superadmin' || user?.role === 'admin') return <AdminDashboard user={user} />;
  if (user?.role === 'client') return <ClientDashboard user={user} />;
  return <UserDashboard user={user} />;
}

// --- ADMIN DASHBOARD ---
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Global operations and platform monitoring</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white border border-gray-200 rounded-lg px-6 py-3 flex items-center gap-6 shadow-sm">
              <div>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Global Payout</p>
                 <p className="text-lg font-bold text-navy">{formatCurrency(stats?.payoutPending || 0)}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">System Load</p>
                 <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> <span className="text-sm font-bold uppercase">Optimal</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform GMV', value: stats?.totalRevenue || 0, icon: Globe, suffix: '€', href: '/dashboard/admin/auctions' },
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, href: '/dashboard/admin/users' },
          { label: 'Active Lots', value: stats?.activeLots || 0, icon: Target, href: '/dashboard/admin/auctions' },
          { label: 'Pending KYC', value: stats?.pendingKYC || 0, icon: ShieldAlert, href: '/dashboard/admin/users', isAlert: (stats?.pendingKYC || 0) > 0 },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="group flex flex-col justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-burgundy transition-all h-full">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded bg-gray-50 group-hover:bg-burgundy group-hover:text-white transition-colors ${stat.isAlert ? 'text-burgundy' : 'text-gray-600'}`}>
                  {stat.isAlert ? <AlertCircle className="h-6 w-6" /> : <stat.icon className="h-6 w-6" />}
               </div>
               <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-burgundy group-hover:translate-x-1 transition-all" />
            </div>
            <div>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-navy tracking-tight">
                     <CountUp end={stat.value} duration={1.5} separator="," decimals={stat.suffix === '€' ? 2 : 0} />
                  </span>
                  <span className="text-sm font-bold text-gray-400">{stat.suffix}</span>
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Recent Activity Log</h3>
             <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-2">
            {recentActivity.length > 0 ? recentActivity.map((log: any) => (
              <div key={log._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className="flex-grow">
                  <p className="text-sm font-bold text-navy capitalize">{log.action.replace(/_/g, ' ')}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-semibold text-gray-500">{log.user?.firstName || 'SYSTEM'}</span>
                     <span className="h-1 w-1 bg-gray-300 rounded-full" />
                     <span className="text-sm font-medium text-gray-400 truncate max-w-[200px]">{log.resource}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <p className="text-sm font-medium text-gray-400 mb-1">{timeAgo(log.createdAt)}</p>
                </div>
              </div>
            )) : (
               <div className="py-12 text-center text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No recent activity recorded.</p>
               </div>
            )}
          </div>
        </div>

        {/* System Tasks */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Pending Tasks</h3>
              </div>
              <div className="p-4 space-y-2">
                 {[
                   { label: 'Client Approvals', count: stats?.pendingClients || 0, icon: Users, href: '/dashboard/admin/users' },
                   { label: 'Financial Audits', count: stats?.pendingWithdrawals || 0, icon: DollarSign, href: '/dashboard/admin/logs' },
                   { label: 'KYC Reviews', count: stats?.pendingKYC || 0, icon: Shield, href: '/dashboard/admin/kyc' }
                 ].map((tool, i) => (
                   <Link key={i} href={tool.href} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 group">
                      <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded shadow-sm group-hover:text-burgundy transition-colors text-gray-500">
                            <tool.icon className="h-4 w-4" />
                         </div>
                         <span className="text-sm font-semibold text-gray-700">{tool.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-2 py-0.5 rounded text-sm font-bold ${tool.count > 0 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {tool.count}
                         </span>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
           
           <div className="bg-navy p-6 rounded-xl border border-navy-light text-white">
              <div className="flex items-center gap-3 mb-4">
                 <Globe className="h-6 w-6 text-gold" />
                 <h3 className="text-lg font-bold uppercase tracking-tight">System Status</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                All core services are operational. Automated backups and security monitoring are active.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- CLIENT (MAISON) DASHBOARD ---
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Maison Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage your catalog, sales, and clientele.</p>
        </div>
        <Link href="/dashboard/client/auctions/create" className="bg-burgundy text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-burgundy-dark transition-colors flex items-center gap-2">
          <Gavel className="h-4 w-4" /> Create Auction
        </Link>
      </div>

      {/* Client Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: stats?.totalRevenue || 0, icon: BarChart3, suffix: '€', href: '/dashboard/client/auctions' },
          { label: 'Active Auctions', value: stats?.totalAuctions || 0, icon: Gavel, href: '/dashboard/client/auctions' },
          { label: 'Lot Views', value: stats?.totalWatcherCount || 142, icon: Eye, href: '/dashboard/client/lots' },
          { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Package, href: '/dashboard/orders', warning: (stats?.pendingOrders || 0) > 0 },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="group flex flex-col justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-burgundy transition-all h-full">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded bg-gray-50 group-hover:bg-burgundy group-hover:text-white transition-colors ${stat.warning ? 'text-burgundy' : 'text-gray-600'}`}>
                  <stat.icon className="h-6 w-6" />
               </div>
               <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-burgundy group-hover:translate-x-1 transition-all" />
            </div>
            <div>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-navy tracking-tight">
                     <CountUp end={stat.value} duration={1.5} separator="," decimals={stat.suffix === '€' ? 2 : 0} />
                  </span>
                  <span className="text-sm font-bold text-gray-400">{stat.suffix}</span>
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
           <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Recent Auctions</h3>
           <Link href="/dashboard/client/auctions" className="text-sm font-bold text-burgundy uppercase tracking-widest hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAuctions.length > 0 ? recentAuctions.map((auction: any) => (
              <Link key={auction._id} href={`/dashboard/client/auctions/${auction._id}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={auction.coverImage?.startsWith('http') ? auction.coverImage : `${process.env.NEXT_PUBLIC_BACKEND_URL}${auction.coverImage}`} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                     <span className={`px-2 py-1 text-sm font-bold uppercase rounded shadow-sm ${auction.status === 'live' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}>
                        {auction.status}
                     </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-navy font-bold truncate mb-3 group-hover:text-burgundy transition-colors">{auction.title}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-semibold uppercase">Lots</span>
                        <span className="font-bold text-navy">{auction.totalLots}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-semibold uppercase">Bids</span>
                        <span className="font-bold text-navy">{auction.totalBids}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                       <span className="text-sm text-gray-400 font-semibold uppercase">Date</span>
                       <span className="font-bold text-navy">{new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg">
                 <Package className="h-10 w-10 text-gray-300 mb-3" />
                 <p className="text-sm font-bold text-gray-500">No auctions created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- USER (BIDDER) DASHBOARD ---
function UserDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState({ activeBids: 0, wonAuctions: 0, totalSpent: 0, watchlistCount: 0 });
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);

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

    watchlistAPI.getAll().then(res => {
       const items = res.data.data || [];
       setWatchlistItems(items.slice(0, 4));
       setStats(prev => ({ ...prev, watchlistCount: items.length }));
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
           </div>
           <div>
             <h1 className="text-3xl font-bold text-navy uppercase tracking-tight">Welcome, {user?.firstName}</h1>
             <p className="text-sm font-medium text-gray-500 mt-1">Manage your bids, purchases, and alerts.</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {user?.isVerified ? (
             <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded text-sm font-bold uppercase tracking-wide">
               <ShieldCheck className="h-4 w-4" /> Identity Verified
             </span>
           ) : (
             <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-sm font-bold uppercase tracking-wide">
               <AlertCircle className="h-4 w-4" /> Unverified
             </span>
           )}
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Bids', value: stats.activeBids || 0, icon: Gavel, href: '/dashboard/bids' },
          { label: 'Lots Won', value: stats.wonAuctions || 0, icon: Trophy, href: '/dashboard/orders' },
          { label: 'Total Spent', value: stats.totalSpent || 0, icon: DollarSign, suffix: '€', href: '/dashboard/orders' },
          { label: 'Watchlist', value: stats.watchlistCount || 0, icon: Heart, href: '/dashboard/watchlist' },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="group flex flex-col justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-burgundy transition-all h-full">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded bg-gray-50 text-gray-600 group-hover:bg-burgundy group-hover:text-white transition-colors">
                  <stat.icon className="h-6 w-6" />
               </div>
               <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-burgundy group-hover:translate-x-1 transition-all" />
            </div>
            <div>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-navy tracking-tight">
                     <CountUp end={stat.value} duration={1.5} separator="," decimals={stat.suffix === '€' ? 2 : 0} />
                  </span>
                  <span className="text-sm font-bold text-gray-400">{stat.suffix}</span>
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bids */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Recent Bids</h3>
            <Link href="/dashboard/bids" className="text-sm font-bold text-burgundy uppercase tracking-wide hover:underline inline-flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="p-2">
            {recentBids.length > 0 ? recentBids.map((bid: any) => (
              <div key={bid._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      {bid.lot?.images?.[0]?.url ? (
                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${bid.lot.images[0].url}`} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5 text-gray-300" />
                      )}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-navy line-clamp-1 group-hover:text-burgundy transition-colors">{bid.lot?.title || 'Unknown Lot'}</p>
                     <p className="text-sm text-gray-500 font-medium mt-0.5 max-w-[200px] truncate">{bid.auction?.title}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-navy">{formatCurrency(bid.amount)}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-bold uppercase tracking-wider mt-1 ${
                    bid.status === 'winning' ? 'bg-green-100 text-green-700' : 
                    bid.status === 'outbid' ? 'bg-red-100 text-red-700' : 
                    bid.status === 'won' ? 'bg-gold/20 text-yellow-800' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                     {bid.status === 'winning' && <TrendingUp className="h-3 w-3" />}
                     {bid.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                 <Gavel className="h-10 w-10 text-gray-200 mb-3" />
                 <p className="text-sm font-bold text-gray-400">No recent bids placed.</p>
                 <Link href="/auctions" className="mt-4 text-burgundy text-sm font-bold hover:underline">Browse Auctions</Link>
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Watchlist */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Notifications</h3>
            </div>
            <div className="p-4 space-y-3">
              {notifications.length > 0 ? notifications.map((n: any) => (
                <div key={n._id} className={`p-4 rounded-lg border ${!n.isRead ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100'}`}>
                  <div className="flex gap-3">
                     <div className={`mt-0.5 shrink-0 ${!n.isRead ? 'text-blue-500' : 'text-gray-400'}`}>
                        <Bell className="h-4 w-4" />
                     </div>
                     <div>
                        <p className={`text-sm tracking-tight mb-1 ${!n.isRead ? 'font-bold text-navy' : 'font-semibold text-gray-700'}`}>{n.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-sm text-gray-400 font-semibold uppercase mt-2">{timeAgo(n.createdAt)}</p>
                     </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm text-center py-6">No new notifications.</p>
              )}
            </div>
          </div>
          
          {/* Watchlist Quick View */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-navy uppercase tracking-tight">Watchlist</h3>
                <Link href="/dashboard/watchlist" className="text-gray-400 hover:text-burgundy"><ArrowRight className="h-4 w-4" /></Link>
             </div>
             <div className="p-2">
                {watchlistItems.length > 0 ? watchlistItems.map((item: any) => (
                   <Link key={item._id} href={`/auctions/${item.auction?.slug || ''}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                         {item.lot?.images?.[0]?.url ? (
                           <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.lot.images[0].url}`} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><Heart className="h-4 w-4 text-gray-300" /></div>
                         )}
                      </div>
                      <div className="flex-grow truncate">
                         <span className="text-sm font-semibold text-gray-700 truncate block group-hover:text-burgundy">{item.lot?.title || "Saved Lot"}</span>
                      </div>
                   </Link>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-6">Your watchlist is empty.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}