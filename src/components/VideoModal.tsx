"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, Heart, Share2, Trash2 } from "lucide-react";
import { VideoItem } from "@/types/video";
import { formatInstagramEmbedUrl } from "@/lib/utils";

interface VideoModalProps {
  video: VideoItem | null;
  isAdmin?: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteVideo?: (id: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  isAdmin = false,
  onClose,
  onToggleFavorite,
  onDeleteVideo,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const embedUrl = formatInstagramEmbedUrl(video.url);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.caption,
        url: video.url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(video.url);
      alert("Video linki panoya kopyalandı!");
    }
  };

  const handleDelete = () => {
    if (onDeleteVideo) {
      onDeleteVideo(video.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Arka plan karartması */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Kartı */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl md:flex-row">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 backdrop-blur-md transition-all hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sol Taraf: Instagram Embed Oynatıcı */}
        <div className="relative flex aspect-[9/16] w-full max-h-[50vh] shrink-0 items-center justify-center bg-black md:max-h-none md:w-[420px]">
          <iframe
            src={embedUrl}
            className="h-full w-full border-none"
            allowTransparency={true}
            allow="autoplay; encrypted-media"
            title={video.title}
          />
        </div>

        {/* Sağ Taraf: Video Bilgileri & Aksiyonlar */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 md:p-8">
          <div className="space-y-4">
            {/* Kategori & Tarih */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400">
                {video.category}
              </span>
              <span className="text-xs text-zinc-500">
                {new Date(video.addedAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Başlık */}
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {video.title}
            </h2>

            {/* Açıklama */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {video.caption || "Bu video için ek bir açıklama bulunmuyor."}
              </p>
            </div>

            {/* Etiketler */}
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {video.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Alt Aksiyon Butonları */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-800/80 pt-6">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition-all hover:brightness-110"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Instagram'da Aç</span>
            </a>

            <button
              onClick={(e) => onToggleFavorite(video.id, e)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                video.isFavorite
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  video.isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{video.isFavorite ? "Favorilerde" : "Favorile"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              <span>Paylaş</span>
            </button>

            {/* Sadece Admin İçin Sil Butonu */}
            {isAdmin && onDeleteVideo && (
              <button
                onClick={handleDelete}
                title="Videoyu Sil (Yönetici)"
                className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                <span>Sil</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
