"use client";

import React from "react";
import { CATEGORIES } from "@/data/initialVideos";
import { VideoItem } from "@/types/video";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  videos: VideoItem[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  setActiveCategory,
  videos,
}) => {
  // Her kategoride kaç video olduğunu hesaplayalım
  const getCount = (cat: string) => {
    if (cat === "Tümü") return videos.length;
    if (cat === "Favorilerim") return videos.filter(v => v.isFavorite).length;
    return videos.filter(v => v.category === cat).length;
  };

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-none">
      <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const count = getCount(category);

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span>{category}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
