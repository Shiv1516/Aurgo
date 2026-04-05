"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { PageLoader } from "@/components/common/LoadingSpinner";
import {
  LayoutDashboard,
  Gavel,
  Heart,
  Package,
  Bell,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";

const roleLinks: Record<string, any[]> = {
  superadmin: [
    { href: "/dashboard", label: "Operations Room", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Citizen Hub", icon: User },
    { href: "/dashboard/admin/auctions", label: "Global Auctions", icon: Gavel },
    { href: "/dashboard/orders", label: "Finance & Orders", icon: Package },
    { href: "/dashboard/settings", label: "System Config", icon: Settings },
  ],
  admin: [
    { href: "/dashboard", label: "Operations Room", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Citizen Hub", icon: User },
    { href: "/dashboard/admin/auctions", label: "Global Auctions", icon: Gavel },
    { href: "/dashboard/orders", label: "Finance & Orders", icon: Package },
    { href: "/dashboard/settings", label: "System Config", icon: Settings },
  ],
  client: [
    { href: "/dashboard", label: "Mission Control", icon: LayoutDashboard },
    { href: "/dashboard/client/auctions", label: "My Boutique", icon: Gavel },
    { href: "/dashboard/client/lots", label: "Inventory Hub", icon: Package },
    { href: "/dashboard/orders", label: "Sales & Orders", icon: Package },
    { href: "/dashboard/profile", label: "Maison Profile", icon: User },
    { href: "/dashboard/settings", label: "Studio Settings", icon: Settings },
  ],
  user: [
    { href: "/dashboard", label: "Vault Overview", icon: LayoutDashboard },
    { href: "/dashboard/bids", label: "Live Bids", icon: Gavel },
    { href: "/dashboard/watchlist", label: "Watchlist", icon: Heart },
    { href: "/dashboard/orders", label: "Acquisitions", icon: Package },
    { href: "/dashboard/notifications", label: "Intel", icon: Bell },
    { href: "/dashboard/profile", label: "Identity Hub", icon: User },
    { href: "/dashboard/settings", label: "Preferences", icon: Settings },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && !isAuthenticated) return null;

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        {/* Top Navbar for Mobile/Tablet */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <span className="text-xl font-black text-navy uppercase tracking-tighter">NAVIGATOR</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <Menu className="h-5 w-5 text-navy" />
          </button>
        </div>

        <div className="flex flex-1 w-full relative">
          {/* Sidebar - Professional Style */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-500 lg:sticky lg:top-0 lg:h-screen lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between lg:hidden mb-8">
                <span className="text-2xl font-black tracking-tighter uppercase">Navigator</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Header - Mini Profile */}
              <div className="mb-10 px-2 flex items-center gap-4">
                <div className="h-12 w-12 bg-navy rounded-2xl flex items-center justify-center shadow-xl shadow-burgundy/5">
                  <User className="h-6 w-6 text-burgundy" />
                </div>
                <div className="flex flex-col">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-24 bg-gray-100 animate-pulse rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-50 animate-pulse rounded" />
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black text-dark uppercase">{user?.firstName}</span>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{user?.role}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mb-4 px-4">Management</div>
              <nav className="space-y-2">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-gray-50/50 animate-pulse">
                      <div className="h-5 w-5 bg-gray-100 rounded" />
                      <div className="h-4 w-32 bg-gray-100 rounded" />
                    </div>
                  ))
                ) : (
                  (roleLinks[user?.role || "user"] || roleLinks.user).map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive ? "bg-burgundy text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-navy"}`}
                      >
                        <link.icon className={`h-5 w-5 ${isActive ? "" : "group-hover:text-burgundy"}`} />
                        <span className="font-bold text-sm uppercase tracking-wide">{link.label}</span>
                      </Link>
                    );
                  })
                )}
              </nav>

              {/* Sidebar Footer - Security */}
              <div className="mt-12 pt-8 border-t border-gray-200 px-4">
                 <div className="flex items-center gap-2 text-sm font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Secure Access
                 </div>
              </div>
            </div>
          </aside>
          
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 bg-[#fafafa]">
            <div className="w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
