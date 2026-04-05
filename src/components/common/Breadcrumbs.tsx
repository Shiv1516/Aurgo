'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';


interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      <Link 
        href="/" 
        className="flex items-center gap-1.5 font-black text-navy/40 uppercase tracking-[0.1em] hover:text-burgundy transition-colors shrink-0"
      >
        <Home className="h-5 w-5" /> Base
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-5 w-5 text-navy/20 shrink-0" />
          {item.active ? (
            <span className="text-sm font-black text-burgundy uppercase tracking-[0.1em] truncate">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href || '#'} 
              className="text-sm font-black text-navy/40 uppercase tracking-[0.1em] hover:text-burgundy transition-colors truncate shrink-0"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
