"use client";

import React, { useRef } from "react";
import { 
  BookmarkCheck, 
  Search, 
  LayoutGrid, 
  PlaySquare, 
  Upload, 
  Download, 
  Plus, 
  X,
  Heart,
  Lock,
  ShieldCheck
} from "lucide-react";
import { ViewMode } from "@/types/video";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onImportJson: (file: File) => void;
  onExportJson: () => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onImportJson,
  onExportJson,
  onOpenAddModal,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  isAdmin,
  onOpenAdminModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-pink-500/20">
            <BookmarkCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">
              Insta<span className="text-pink-500">Vault</span>
            </span>
            {isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
        </div>

        {/* Arama Barı */}
        <div className="relative mx-4 hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Başlıklarda, açıklamalarda veya etiketlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/90 py-2 pl-10 pr-9 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-pink-500/60 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Aksiyonlar */}
        <div className="flex items-center gap-2">
          {/* Görünüm Modu Değiştirici (Grid vs Reels) */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <button
              onClick={() => setViewMode("grid")}
              title="Kütüphane (Grid) Modu"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Galeri</span>
            </button>
            <button
              onClick={() => setViewMode("reels")}
              title="Reels / Akış Modu"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "reels"
                  ? "bg-pink-600 text-white shadow-sm shadow-pink-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <PlaySquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reels</span>
            </button>
          </div>

          {/* Favoriler Butonu (Herkes görebilir) */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            title="Favorilerim"
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              showOnlyFavorites
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-red-500 text-red-500" : ""}`} />
            <span className="hidden sm:inline">{favoritesCount}</span>
          </button>

          {/* SADECE YÖNETİCİYE ÖZEL AKSİYONLAR */}
          {isAdmin ? (
            <>
              {/* Video Ekle Butonu */}
              <button
                onClick={onOpenAddModal}
                title="Manuel Video Ekle"
                className="flex items-center gap-1.5 rounded-lg border border-pink-500/40 bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-300 transition-all hover:bg-pink-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ekle</span>
              </button>

              {/* JSON İçe Aktar */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="JSON Yükle (Eklentiden aldığınız dosya)"
                className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-all hover:bg-blue-500/20"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden md:inline">İçe Aktar</span>
              </button>

              {/* JSON Dışa Aktar */}
              <button
                onClick={onExportJson}
                title="Yedek JSON İndir"
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </>
          ) : null}

          {/* Gizli / Küçük Yönetici Giriş İkonu */}
          <button
            onClick={onOpenAdminModal}
            title={isAdmin ? "Yönetici Çıkışı Yap" : "Yönetici Girişi (Sadece Site Sahibi)"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
              isAdmin
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobil Arama Barı */}
      <div className="border-t border-zinc-800/60 p-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Video ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-9 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};
