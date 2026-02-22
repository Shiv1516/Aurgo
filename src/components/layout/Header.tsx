'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
  Search, Bell, User, Menu, X, ChevronDown, Gavel,
  LayoutDashboard, Heart, Package, LogOut, Settings, TrendingUp
} from 'lucide-react';
import { getSocket } from '@/lib/socket';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activities, setActivities] = useState<any[]>([
    { type: 'init', message: 'Augeo World-Class Auctions Now Live' },
    { type: 'init', message: 'Discover the extraordinary in our latest collections' },
    { type: 'init', message: 'Institutional grade assets at your fingertips' }
  ]);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const s = getSocket();
    s.on('activity:global', (data) => {
      let message = '';
      if (data.type === 'bid') {
        message = `New Bid: ${data.title} - $${data.amount.toLocaleString()} by ${data.bidderName}`;
      } else if (data.type === 'auction_started') {
        message = `Auction Now Live: ${data.title}`;
      } else if (data.type === 'auction_ending_soon') {
        message = `Ending Soon: ${data.title} (${data.minutesLeft}m left)`;
      }
      
      if (message) {
        setActivities(prev => [
          { type: data.type, message },
          ...prev.slice(0, 4)
        ]);
      }
    });

    return () => {
      s.off('activity:global');
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'superadmin' || user.role === 'admin') return '/admin';
    if (user.role.startsWith('client')) return '/client';
    return '/dashboard';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-2xl shadow-black/5 pb-1' : 'bg-white/90 backdrop-blur-2xl pb-3'}`}>
      {!isScrolled && (
        <div className="bg-gold text-[9px] font-black uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap py-1.5 border-b border-black/5">
          <div className="flex animate-marquee">
            {activities.concat(activities).map((activity, i) => (
              <span key={i} className="mx-8 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${activity.type === 'init' ? 'bg-black/40' : 'bg-red-600'}`} />
                {activity.message}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="bg-[#0a0a0b] text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-6">
              <Link href="/pages/how-it-works" className="hover:text-gold transition-colors">Concierge Guide</Link>
              <Link href="/pages/buyers-premium" className="hover:text-gold transition-colors">Auction Terms</Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/pages/about" className="hover:text-gold transition-colors">Our Ethos</Link>
              <Link href="/pages/contact" className="hover:text-gold transition-colors">Private Treaty</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Premium Brand Style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-[#0a0a0b] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-gold/5">
              <Gavel className="h-6 w-6 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-dark tracking-tighter leading-none">AUGEO</span>
              <span className="text-[8px] font-bold text-gold tracking-[0.4em] uppercase">Est. 2026</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-12">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rare collections..."
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-gold/30 focus:ring-4 focus:ring-gold/5 transition-all text-sm font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gold transition-colors" />
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-10">
            <Link href="/auctions" className="text-gray-500 hover:text-dark font-bold transition-all text-[13px] uppercase tracking-widest relative group">
              Auctions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
            </Link>
            <Link href="/categories" className="text-gray-500 hover:text-dark font-bold transition-all text-[13px] uppercase tracking-widest relative group">
              Curated
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <Link href="/dashboard/watchlist" className="relative p-2.5 text-gray-400 hover:text-gold transition-all hover:bg-gold/5 rounded-xl">
                  <Heart className="h-5 w-5" />
                </Link>

                <Link href="/dashboard/notifications" className="relative p-2.5 text-gray-400 hover:text-gold transition-all hover:bg-gold/5 rounded-xl">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-black border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl border border-gray-100 hover:border-gold/20 hover:shadow-lg transition-all"
                  >
                    <div className="h-9 w-9 bg-[#0a0a0b] rounded-xl flex items-center justify-center shadow-inner">
                      <User className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex flex-col items-start pr-2">
                       <span className="text-[11px] font-black text-dark uppercase">{user?.firstName}</span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{user?.role}</span>
                    </div>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-3 animate-slide-up origin-top-right overflow-hidden">
                      <div className="px-5 py-3 mb-2 bg-gradient-to-br from-gray-50 to-transparent">
                        <p className="font-black text-sm text-dark">{user?.fullName}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{user?.email}</p>
                      </div>

                      <div className="px-2 space-y-1">
                        <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:bg-gold/10 hover:text-gold rounded-xl transition-all" onClick={() => setIsUserMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" /> Executive Dashboard
                        </Link>
                        <Link href="/dashboard/bids" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:bg-gold/10 hover:text-gold rounded-xl transition-all" onClick={() => setIsUserMenuOpen(false)}>
                          <Gavel className="h-4 w-4" /> Live Bids
                        </Link>
                        <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:bg-gold/10 hover:text-gold rounded-xl transition-all" onClick={() => setIsUserMenuOpen(false)}>
                          <Package className="h-4 w-4" /> Acquisition Portfolio
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:bg-gold/10 hover:text-gold rounded-xl transition-all" onClick={() => setIsUserMenuOpen(false)}>
                          <Settings className="h-4 w-4" /> Private Settings
                        </Link>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100/50 px-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-xl w-full uppercase tracking-wider"
                        >
                          <LogOut className="h-4 w-4" /> Security Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-[11px] font-black text-gray-400 hover:text-dark transition-colors uppercase tracking-widest">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-[10px] !py-2.5 !px-6 uppercase tracking-[0.2em] font-black">
                  Join Guild
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auctions..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
          <nav className="px-4 pb-4 space-y-1">
            <Link href="/auctions" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Auctions</Link>
            <Link href="/categories" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()} className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/watchlist" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</Link>
                <Link href="/dashboard/notifications" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Notifications {unreadCount > 0 && <span className="badge bg-accent text-white ml-2">{unreadCount}</span>}
                </Link>
                <button onClick={handleLogout} className="block py-2.5 text-red-600 font-medium w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2.5 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="block py-2.5 text-gold font-medium" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
