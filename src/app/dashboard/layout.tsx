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

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  if (!isAuthenticated) return null;

  return (
    <>
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar - Executive Guild Style */}
            <aside
              className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-black/5 border border-white p-6 transform transition-transform duration-500 lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
              <div className="flex items-center justify-between lg:hidden mb-8">
                <span className="text-xl font-black tracking-tighter">NAVIGATOR</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Header - Mini Profile */}
              <div className="mb-10 px-2 flex items-center gap-4">
                <div className="h-12 w-12 bg-dark rounded-2xl flex items-center justify-center shadow-xl shadow-gold/10">
                  <User className="h-6 w-6 text-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-dark uppercase">{user?.firstName}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</span>
                </div>
              </div>

              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Management</div>
              <nav className="space-y-2">
                {(roleLinks[user?.role || "user"] || roleLinks.user).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive ? "bg-dark text-gold shadow-xl shadow-gold/5" : "text-gray-400 hover:bg-gray-50 hover:text-dark"}`}
                    >
                      <link.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-gold"}`} />
                      <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-white" : ""}`}>{link.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_#c9a84c]" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Footer - Security */}
              <div className="mt-12 pt-8 border-t border-gray-100 px-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Secure Access
                 </div>
              </div>
            </aside>
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main */}
            <main className="flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border"
              >
                <Menu className="h-5 w-5" />
              </button>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
