"use client";

import React, { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { VideoItem } from "@/types/video";
import { autoDetectCategory } from "@/lib/utils";
import { CATEGORIES } from "@/data/initialVideos";

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (video: VideoItem) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Genel");
  const [cover, setCover] = useState("");

  if (!isOpen) return null;

  // Başlık girildikçe kategoriyi otomatik öner
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (val.length > 3) {
      const predicted = autoDetectCategory(val, caption);
      setCategory(predicted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const newVideo: VideoItem = {
      id: "vid-" + Date.now(),
      url: url.trim(),
      type: "video",
      title: title.trim() || "İsimsiz Video",
      caption: caption.trim(),
      category: category,
      cover: cover.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
      addedAt: new Date().toISOString(),
      isFavorite: false,
    };

    onAdd(newVideo);
    onClose();
    // Sıfırla
    setUrl("");
    setTitle("");
    setCaption("");
    setCategory("Genel");
    setCover("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-pink-500" />
            <span>Yeni Video Ekle</span>
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400">Instagram Gönderi / Reel Linki *</label>
            <input
              type="url"
              required
              placeholder="https://www.instagram.com/reel/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400">Başlık</label>
            <input
              type="text"
              placeholder="Örn: 5 Dakikada Python Otomasyonu"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
              <span>Kategori</span>
              <span className="text-[10px] text-pink-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Otomatik Algılama
              </span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-zinc-100 focus:border-pink-500 focus:outline-none"
            >
              {CATEGORIES.filter(c => c !== "Tümü" && c !== "Favorilerim").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400">Açıklama (Opsiyonel)</label>
            <textarea
              rows={2}
              placeholder="Video hakkında kısa bilgi veya notlar..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition-all hover:brightness-110"
            >
              Kütüphaneye Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
