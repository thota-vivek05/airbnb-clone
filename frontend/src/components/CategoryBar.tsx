"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onFilterClick: () => void;
}

export default function CategoryBar({ activeCategory, onCategoryChange, onFilterClick }: CategoryBarProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-[73px] z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2">
          <div className="flex-1 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 border-l border-gray-200 pl-4">
            <button onClick={onFilterClick} className="filter-btn">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
