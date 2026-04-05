"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { categoryAPI } from "@/lib/api";
import { Category } from "@/types";
import { 
  Grid3x3, ArrowRight, Star, Car, Palette, Sofa, Gem, Watch, Home, Laptop, Shirt, Music, Coins, Smartphone, Sparkles
} from "lucide-react";
import { CategoryGridSkeleton } from "@/components/common/Skeletons";
import { getAssetUrl } from "@/lib/utils";

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("auto")) return <Car className="h-8 w-8" />;
  if (lower.includes("art") || lower.includes("paint") || lower.includes("sculpture")) return <Palette className="h-8 w-8" />;
  if (lower.includes("furniture") || lower.includes("home") || lower.includes("antiques")) return <Sofa className="h-8 w-8" />;
  if (lower.includes("jewel") || lower.includes("ring") || lower.includes("diamond")) return <Gem className="h-8 w-8" />;
  if (lower.includes("watch") || lower.includes("time") || lower.includes("clock")) return <Watch className="h-8 w-8" />;
  if (lower.includes("estate") || lower.includes("property")) return <Home className="h-8 w-8" />;
  if (lower.includes("tech") || lower.includes("electron") || lower.includes("computer")) return <Laptop className="h-8 w-8" />;
  if (lower.includes("fashion") || lower.includes("cloth") || lower.includes("bag")) return <Shirt className="h-8 w-8" />;
  if (lower.includes("music") || lower.includes("instrument")) return <Music className="h-8 w-8" />;
  if (lower.includes("coin") || lower.includes("stamp") || lower.includes("collect")) return <Coins className="h-8 w-8" />;
  if (lower.includes("phone") || lower.includes("gadget") || lower.includes("mobile")) return <Smartphone className="h-8 w-8" />;
  return <Sparkles className="h-8 w-8" />;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // if (isLoading) return <PageLoader />;
  return (
    <>
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-navy tracking-tighter mb-4">
            EXPLORE <span className="text-burgundy uppercase">CATEGORIES</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl">
            Browse through our wide range of auction categories.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-20">
        {isLoading ? (
          <CategoryGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, index) => (
              <Link 
                key={cat._id} 
                href={`/categories/${cat.slug}`}
                className="group animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <div className="card h-80 relative flex flex-col p-0 group">
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-30" />
                  
                  {/* Background Layer with Zoom */}
                  <div className="absolute inset-0 z-0 bg-navy overflow-hidden">
                    {cat.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000 ease-out"
                        style={{ backgroundImage: `url(${getAssetUrl(cat.image)})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-burgundy/30 opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10" />
                  </div>
                  
                  <div className="relative z-20 flex flex-col h-full items-center justify-center text-center p-8">
                    {/* Glassmorphic Icon Container */}
                    <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 mb-6 group-hover:bg-gold group-hover:text-navy group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700 shadow-xl">
                      {getCategoryIcon(cat.name)}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-3">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 mb-1">Explore Portfolio</span>
                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter group-hover:text-white transition-colors duration-500">
                          {cat.name}
                        </h3>
                      </div>
                      
                      {cat.description && (
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 line-clamp-2 max-w-[200px] mx-auto italic">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Utility */}
                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {categories.length === 0 && (
          <div className="text-center py-20">
            <Grid3x3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </>
  );
}
