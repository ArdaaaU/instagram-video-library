"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { VideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";
import { ReelsView } from "@/components/ReelsView";
import { AddVideoModal } from "@/components/AddVideoModal";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { VideoItem, ViewMode } from "@/types/video";
import { Film, Sparkles, SlidersHorizontal, Loader2 } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Videoları Sunucudan Yükle
  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error("Videolar yüklenirken hata:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Admin Durumunu ve Favorileri Yükle
  useEffect(() => {
    // Favorileri yerel tarayıcıdan al
    try {
      const savedFavs = localStorage.getItem("instavault_user_favorites");
      if (savedFavs) {
        setFavorites(new Set(JSON.parse(savedFavs)));
      }
    } catch {}

    // Sunucudan videoları ve admin durumunu çek
    fetchVideos();
    checkAdminStatus();
  }, [fetchVideos]);

  const checkAdminStatus = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAdmin(Boolean(data.isAdmin));
    } catch {
      setIsAdmin(false);
    }
  };

  // Klavye Kısayolu: Ctrl + Shift + A -> Gizli Admin Paneli Aç
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Favorileme Toggle (Kullanıcının kendi tarayıcısında saklanır)
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) {
      newFavs.delete(id);
    } else {
      newFavs.add(id);
    }
    setFavorites(newFavs);
    localStorage.setItem("instavault_user_favorites", JSON.stringify(Array.from(newFavs)));

    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo((prev) => (prev ? { ...prev, isFavorite: newFavs.has(id) } : null));
    }
  };

  // Video Silme (SUNUCU TARAFLI SİLME - SADECE ADMİN)
  const handleDeleteVideo = async (id: string) => {
    if (!isAdmin) {
      alert("Güvenlik Uyarısı: Sadece yetkili yönetici silebilir!");
      return;
    }

    if (!confirm("Bu videoyu kütüphaneden tamamen silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        // UI'dan videoyu kaldır
        setVideos((prev) => prev.filter((v) => v.id !== id));
        if (selectedVideo && selectedVideo.id === id) {
          setSelectedVideo(null); // Modalı kapat
        }
        alert("Video başarıyla silindi!");
      } else {
        alert(data.error || "Video silinirken bir hata oluştu.");
      }
    } catch (err) {
      alert("Sunucu ile bağlantı kurulamadı.");
    }
  };

  // Yeni Video Ekleme (SUNUCU TARAFLI EKLEME)
  const handleAddVideo = async (newVideo: VideoItem) => {
    if (!isAdmin) {
      alert("Güvenlik Uyarısı: Sadece yetkili yönetici video ekleyebilir!");
      return;
    }

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.videos) {
          setVideos(data.videos);
        } else {
          fetchVideos();
        }
        alert(data.message || "Video başarıyla kütüphaneye eklendi!");
      } else {
        alert(data.error || "Video eklenirken hata oluştu.");
      }
    } catch {
      alert("Sunucuya bağlanılamadı.");
    }
  };

  // JSON Dosyasından İçe Aktarma (MÜKERRER KORUMALI)
  const handleImportJson = (file: File) => {
    if (!isAdmin) {
      alert("Güvenlik Uyarısı: Sadece yetkili yönetici dosya aktarabilir!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!Array.isArray(parsed)) {
          alert("Hata: Geçersiz JSON formatı. Bir dizi (array) olmalıdır.");
          return;
        }

        // Sunucuya POST isteği at
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });

        const data = await res.json();

        if (res.ok) {
          if (data.videos) {
            setVideos(data.videos);
          } else {
            fetchVideos();
          }
          alert(data.message);
        } else {
          alert(data.error || "Videolar aktarılırken hata oluştu.");
        }
      } catch (err: any) {
        alert("JSON dosyası okunurken hata: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // JSON Dışa Aktarma
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(videos, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `instavault_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Videoları Favori Durumu ile Birleştir
  const videosWithFavs = useMemo(() => {
    return videos.map((v) => ({
      ...v,
      isFavorite: favorites.has(v.id),
    }));
  }, [videos, favorites]);

  // Filtrelenmiş Videolar
  const filteredVideos = useMemo(() => {
    let result = videosWithFavs.filter((video) => {
      if (showOnlyFavorites && !video.isFavorite) return false;
      if (activeCategory === "Favorilerim" && !video.isFavorite) return false;

      if (activeCategory !== "Tümü" && activeCategory !== "Favorilerim" && video.category !== activeCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = video.title.toLowerCase().includes(query);
        const inCaption = (video.caption || "").toLowerCase().includes(query);
        const inCategory = video.category.toLowerCase().includes(query);
        const inTags = (video.tags || []).some((t) => t.toLowerCase().includes(query));
        return inTitle || inCaption || inCategory || inTags;
      }

      return true;
    });

    // Sıralama Mantığı
    return result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "tr");
      }

      // Tarihleri karşılaştır
      const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
      const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;

      // Eğer tarihler birbirinden farklıysa (en az 1 saniye fark varsa) tarihe göre sırala
      if (Math.abs(timeA - timeB) > 1000) {
        if (sortBy === "newest") {
          return timeB - timeA; // En yeni tarih en üstte
        } else if (sortBy === "oldest") {
          return timeA - timeB; // En eski tarih en üstte
        }
      }

      // Eğer tarihler aynıysa (aynı JSON ile toplu çekildiyse), Instagram'ın orijinal kayıt sırasına göre sırala
      // Eklenti sayfayı yukarıdan aşağıya taradığı için indexA < indexB demek "A daha yeni kaydedilmiş" demektir.
      const indexA = videos.findIndex((v) => v.id === a.id);
      const indexB = videos.findIndex((v) => v.id === b.id);

      if (sortBy === "newest") {
        return indexA - indexB; // En son kaydedilenler (listenin başındakiler) ilk sırada
      } else {
        return indexB - indexA; // En eski kaydedilenler (listenin sonundakiler) ilk sırada
      }
    });
  }, [videosWithFavs, activeCategory, searchQuery, showOnlyFavorites, sortBy]);

  const favoritesCount = useMemo(() => favorites.size, [favorites]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500 mr-2" />
        <span>Kütüphane güvenli şekilde yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-pink-500 selection:text-white">
      {/* Üst Bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onImportJson={handleImportJson}
        onExportJson={handleExportJson}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        favoritesCount={favoritesCount}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Reels Modu */}
      {viewMode === "reels" ? (
        <ReelsView
          videos={filteredVideos}
          onClose={() => setViewMode("grid")}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        /* Galeri Modu */
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          
          {/* Hero Banner */}
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900/60 to-zinc-950 p-6 sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kişisel Video Koleksiyonu</span>
              </div>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Kaydettiğim En İyi Videolar
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Instagram'da kaydettiğim reels ve videoları kategorilerine göre keşfedin veya Reels moduna geçerek ardı ardına izleyin.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-pink-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 right-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
          </div>

          {/* Kategori Filtresi */}
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            videos={videosWithFavs}
          />

          {/* Sayaç ve Sıralama */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-200">{filteredVideos.length}</span>
              <span>video gösteriliyor</span>
              {searchQuery && (
                <span className="text-pink-400">("{searchQuery}" için sonuçlar)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
              <span>Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200 focus:border-pink-500 focus:outline-none"
              >
                <option value="newest">En Yeniler</option>
                <option value="oldest">En Eskiler</option>
                <option value="title">Başlığa Göre (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Video Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isAdmin={isAdmin}
                  onSelect={(v) => setSelectedVideo(v)}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteVideo={() => handleDeleteVideo(video.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
                <Film className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Eşleşen Video Bulunamadı</h3>
              <p className="mt-1 max-w-sm text-xs text-zinc-400">
                Arama kriterlerinizi değiştirmeyi veya yeni videolar eklemeyi deneyin.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Video İzleme Modalı */}
      <VideoModal
        video={selectedVideo}
        isAdmin={isAdmin}
        onClose={() => setSelectedVideo(null)}
        onToggleFavorite={handleToggleFavorite}
        onDeleteVideo={(id) => handleDeleteVideo(id)}
      />

      {/* Video Ekleme Modalı (Sadece Admin Açabilir) */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddVideo}
      />

      {/* Yönetici Giriş Modalı */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLoginSuccess={() => {
          setIsAdmin(true);
          fetchVideos();
        }}
        onLogoutSuccess={() => setIsAdmin(false)}
      />
    </div>
  );
}
