"use client";

import { useSettingsStore, Currency } from "@/store/settingsStore";
import { formatCurrency, convertPrice, cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Portal from "./Portal";

interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  variant?: "navy" | "burgundy" | "white" | "gold";
  showLabel?: boolean;
  label?: string;
  align?: "left" | "right" | "center";
}

export default function PriceDisplay({ 
  amount, 
  className = "", 
  size = "base",
  variant = "navy",
  showLabel = false,
  label = "",
  align = "left"
}: PriceDisplayProps) {
  const { currency, setCurrency, exchangeRates } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const convertedAmount = convertPrice(amount, 'EUR', currency, exchangeRates);
  const formattedPrice = formatCurrency(convertedAmount, currency);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currencies: Currency[] = ['EUR', 'USD', 'GBP', 'INR', 'CNY', 'IRR'];

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  const variantClasses = {
    navy: "text-navy",
    burgundy: "text-burgundy",
    white: "text-white",
    gold: "text-gold",
  };

  const alignClasses = {
    left: "items-start",
    right: "items-end",
    center: "items-center",
  };

  return (
    <div className={cn("flex flex-col group/price", alignClasses[align], className)}>
      {showLabel && label && (
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 leading-none shrink-0">{label}</p>
      )}
      <div className={cn("flex flex-col relative w-full min-w-0", alignClasses[align])}>
        {/* Value with Internal Slider */}
        <div className="w-full overflow-x-auto no-scrollbar pb-0.5">
          <span className={cn("font-black tracking-tighter leading-none whitespace-nowrap transition-all duration-300", sizeClasses[size], variantClasses[variant])}>
            {formattedPrice}
          </span>
        </div>
        
        {/* Selector Container */}
        <div className="relative mt-1">
          <button 
            ref={triggerRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={cn(
              "flex items-center gap-1 text-sm font-black uppercase tracking-[0.1em] transition-all px-2 py-1 rounded-full border shrink-0",
              variant === 'white' 
                ? "text-white/60 border-white/20 hover:text-white hover:border-white/40" 
                : "text-gray-400 border-gray-200 hover:text-burgundy hover:border-burgundy/20"
            )}
          >
            {currency} <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isOpen ? 'rotate-180 text-burgundy' : '')} />
          </button>

          {isOpen && (
            <Portal>
              <div 
                ref={dropdownRef}
                style={{ 
                  position: 'absolute',
                  top: coords.top + 8,
                  left: align === 'right' ? (coords.left + coords.width - 80) : coords.left,
                  zIndex: 9999
                }}
                className="bg-white border border-gray-100 shadow-2xl rounded-xl py-2 min-w-[80px] animate-in fade-in slide-in-from-top-2 duration-300"
              >
                {currencies.map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrency(cur);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center justify-between transition-colors",
                      cur === currency ? 'text-burgundy bg-burgundy/5' : 'text-navy'
                    )}
                  >
                    {cur}
                    {cur === currency && <div className="h-1 w-1 rounded-full bg-burgundy animate-pulse" />}
                  </button>
                ))}
              </div>
            </Portal>
          )}
        </div>
      </div>
    </div>
  );
}
