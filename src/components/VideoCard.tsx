"use client";

import React from "react";
import { Play, Heart, Film, Trash2 } from "lucide-react";
import { VideoItem } from "@/types/video";

interface VideoCardProps {
  video: VideoItem;
  isAdmin?: boolean;
  onSelect: (video: VideoItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteVideo?: (id: string, e: React.MouseEvent) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isAdmin = false,
  onSelect,
  onToggleFavorite,
  onDeleteVideo,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteVideo) {
      onDeleteVideo(video.id, e);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(video.id, e);
  };

  return (
    <div
      onClick={() => onSelect(video)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-pink-950/20"
    >
      {/* Medya / Kapak Görseli */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
        <img
          src={video.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700"}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Karartma Gradyanı */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

        {/* Üst Kısım: Kategori ve Aksiyonlar */}
        <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between">
          <span className="rounded-full bg-zinc-900/80 px-2.5 py-1 text-[11px] font-semibold text-pink-400 backdrop-blur-md">
            {video.category}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Sadece Admin İçin Sil Butonu */}
            {isAdmin && onDeleteVideo && (
              <button
                type="button"
                onClick={handleDeleteClick}
                title="Bu Videoyu Sil (Yönetici)"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-red-700 active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {/* Favorile Butonu */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              title="Favorilere Ekle"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  video.isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Oynat Butonu (Hover'da belirir) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-600/90 text-white shadow-xl shadow-pink-600/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-white" />
          </div>
        </div>

        {/* Alt Bilgi: Başlık & Tarih */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
            <Film className="h-3 w-3 text-pink-500" />
            <span>Reel</span>
            <span>•</span>
            <span>
              {new Date(video.addedAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 group-hover:text-pink-200">
            {video.title}
          </h3>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {video.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-[10px] text-zinc-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
