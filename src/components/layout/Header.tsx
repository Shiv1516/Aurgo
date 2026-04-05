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
import GoogleTranslate from '@/components/common/GoogleTranslate';
import PriceDisplay from '@/components/common/PriceDisplay';

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
  const [socketConnected, setSocketConnected] = useState(true);
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
    
    s.on('connect', () => setSocketConnected(true));
    s.on('disconnect', () => setSocketConnected(false));
    
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
      s.off('connect');
      s.off('disconnect');
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
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b ${isScrolled ? 'shadow-md' : 'border-gray-200'}`}>
      <div className="hidden sm:block bg-navy text-sm font-medium text-white/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-4">
              <Link href="/info/how-it-works" className="hover:text-white transition-colors">How it works</Link>
              <Link href="/info/about" className="hover:text-white transition-colors">About us</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 text-sm font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {socketConnected ? 'SYSTEM LIVE' : 'RECONNECTING...'}
              </div>
              <GoogleTranslate />
              <Link href="/info/contact" className="hover:text-white transition-colors ml-2">Help & Contact</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="text-burgundy">
               <Gavel className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-navy tracking-tighter leading-none">AUGEO</span>
              <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">AUCTIONS</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an auction, a lot, an auction house..."
                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-burgundy focus:ring-0 transition-all text-base"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-burgundy text-white rounded-r-lg hover:bg-burgundy-dark transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Navigation & Actions */}
          <nav className="flex items-center gap-4">
            <Link 
              href="/auctions" 
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-burgundy text-white rounded font-bold text-base uppercase tracking-wider hover:bg-burgundy-dark transition-colors"
            >
              Live Auctions
              <span className="bg-white text-burgundy text-sm px-1.5 py-0.5 rounded-full">
                {activities.length}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 mr-4">
              <Link href="/categories" className="text-navy font-bold text-base uppercase hover:text-burgundy transition-colors">
                Categories
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/notifications" className="p-2 text-navy hover:text-burgundy relative group">
                  <Bell className={`h-5 w-5 sm:h-6 sm:w-6 ${unreadCount > 0 ? 'animate-bell-shake' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-burgundy text-white text-[10px] sm:text-sm rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center font-bold animate-pulse shadow-[0_0_8px_rgba(160,21,35,0.4)]">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1 sm:gap-2 p-1 rounded-full border border-gray-200 hover:border-burgundy transition-all"
                  >
                    <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-50 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-navy" />
                    </div>
                    <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-navy transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <Link href={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-base font-medium text-navy hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/watchlist" className="flex items-center gap-3 px-4 py-2.5 text-base font-medium text-navy hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        <Heart className="h-4 w-4" /> My Watchlist
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut className="h-4 w-4" /> Exit Vault
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="hidden sm:block px-4 py-2 text-navy font-bold text-base uppercase hover:text-burgundy transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="hidden sm:block px-4 py-2 bg-navy text-white rounded font-bold text-base uppercase hover:bg-navy-dark transition-colors">
                  Register
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-navy"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4">
          <form onSubmit={handleSearch}>
             <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an auction, a lot, an auction house..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-base"
            />
          </form>
          <nav className="flex flex-col gap-2">
            <Link href="/auctions" className="py-2 text-navy font-bold uppercase border-b border-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Live Auctions</Link>
            <Link href="/categories" className="py-2 text-navy font-bold uppercase border-b border-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            {!isAuthenticated && (
              <>
                <Link href="/auth/login" className="py-2 text-navy font-bold uppercase border-b border-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/auth/register" className="py-2 text-burgundy font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
