"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Heart, 
  Share2, 
  ExternalLink, 
  X,
  Volume2
} from "lucide-react";
import { VideoItem } from "@/types/video";
import { formatInstagramEmbedUrl } from "@/lib/utils";

interface ReelsViewProps {
  videos: VideoItem[];
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  videos,
  onClose,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVideo = videos[currentIndex];

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Klavye ok tuşları ile geçiş
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, videos.length, onClose]);

  if (!currentVideo) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center text-zinc-400">
        Gösterilecek video bulunamadı.
      </div>
    );
  }

  const embedUrl = formatInstagramEmbedUrl(currentVideo.url);

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Kapat Butonu */}
      <button
        onClick={onClose}
        title="Galeri Görünümüne Dön"
        className="absolute left-6 top-6 z-30 flex items-center gap-2 rounded-full bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md hover:bg-zinc-800 hover:text-white"
      >
        <X className="h-4 w-4" />
        <span>Kapat (Esc)</span>
      </button>

      {/* İlerleme Göstergesi */}
      <div className="absolute top-6 right-6 z-30 rounded-full bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-md">
        {currentIndex + 1} / {videos.length}
      </div>

      {/* Reel Ana Kutusu */}
      <div className="relative flex h-full max-h-[85vh] w-full max-w-[420px] flex-col items-center justify-center">
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <iframe
            key={currentVideo.id} // Her videoda iframe'i yeniden yüklesin
            src={embedUrl}
            className="h-full w-full border-none"
            allowTransparency={true}
            allow="autoplay; encrypted-media"
            title={currentVideo.title}
          />
        </div>

        {/* Sağ Taraf: Aksiyon Butonları (TikTok / Reels tarzı yan panel) */}
        <div className="absolute -right-16 bottom-12 flex flex-col items-center gap-4">
          {/* Favorile */}
          <button
            onClick={(e) => onToggleFavorite(currentVideo.id, e)}
            className="group flex flex-col items-center gap-1 text-zinc-400 hover:text-white"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 backdrop-blur-md transition-all group-hover:scale-110 ${
                currentVideo.isFavorite
                  ? "bg-red-500/20 text-red-500"
                  : "text-zinc-300"
              }`}
            >
              <Heart
                className={`h-6 w-6 ${
                  currentVideo.isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </div>
            <span className="text-[10px] font-medium">Favori</span>
          </button>

          {/* Instagram'da Aç */}
          <a
            href={currentVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1 text-zinc-400 hover:text-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 backdrop-blur-md transition-all group-hover:scale-110">
              <ExternalLink className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">Aç</span>
          </a>

          {/* Paylaş */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: currentVideo.title,
                  url: currentVideo.url,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(currentVideo.url);
                alert("Link kopyalandı!");
              }
            }}
            className="group flex flex-col items-center gap-1 text-zinc-400 hover:text-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 backdrop-blur-md transition-all group-hover:scale-110">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">Paylaş</span>
          </button>
        </div>
      </div>

      {/* Yukarı ve Aşağı Gezinme Okları */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Önceki Video (Yukarı Ok)"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-white backdrop-blur-md transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === videos.length - 1}
          title="Sonraki Video (Aşağı Ok)"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-white backdrop-blur-md transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
