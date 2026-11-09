import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { extractInstagramId, normalizeInstagramUrl, autoDetectCategory } from "@/lib/utils";
import fs from "fs";
import path from "path";
import { VideoItem } from "@/types/video";

const dataFilePath = path.join(process.cwd(), "src", "data", "library.json");

// Dosyadan videoları güvenle oku
function readVideosFromDisk(): VideoItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const content = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(content) || [];
  } catch (err) {
    console.error("Dosya okuma hatası:", err);
    return [];
  }
}

// Dosyaya videoları yaz
function writeVideosToDisk(videos: VideoItem[]): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Dosya yazma hatası:", err);
    return false;
  }
}

// 1. GET: Tüm videoları listele (Herkese açık)
export async function GET() {
  const videos = readVideosFromDisk();
  return NextResponse.json({ videos });
}

// 2. POST: Tekil video veya JSON ile toplu video ekleme (SADECE ADMİN)
export async function POST(req: NextRequest) {
  // Yetki Kontrolü
  const token = req.cookies.get("instavault_session")?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json(
      { error: "Yetkisiz işlem: Sadece yönetici video ekleyebilir!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const incoming: any[] = Array.isArray(body) ? body : [body];

    if (incoming.length === 0) {
      return NextResponse.json({ error: "Eklenecek video bulunamadı" }, { status: 400 });
    }

    const currentVideos = readVideosFromDisk();
    // Mevcut Instagram ID'lerini bir Set içinde topla (Hızlı ve kesin mükerrer kontrolü)
    const existingIds = new Set<string>();
    currentVideos.forEach((v) => {
      const id = extractInstagramId(v.url) || v.id;
      if (id) existingIds.add(id);
    });

    const addedVideos: VideoItem[] = [];
    let skippedCount = 0;

    for (const item of incoming) {
      if (!item.url) continue;

      const instagramId = extractInstagramId(item.url);
      if (!instagramId) {
        skippedCount++;
        continue;
      }

      // Kütüphanede zaten var mı? Varsa ATLA!
      if (existingIds.has(instagramId)) {
        skippedCount++;
        continue;
      }

      // Aynı gelen liste içinde tekrar varsa engelle
      existingIds.add(instagramId);

      const title = (item.title || "İsimsiz Video").trim();
      const caption = (item.caption || "").trim();
      const detectedCat = autoDetectCategory(title, caption);

      const newVideo: VideoItem = {
        id: instagramId,
        url: normalizeInstagramUrl(item.url),
        type: item.type === "post" ? "post" : "video",
        cover: item.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
        title: title,
        caption: caption,
        category: item.category && item.category !== "Genel" ? item.category : detectedCat,
        tags: Array.isArray(item.tags) ? item.tags : [],
        addedAt: item.addedAt || new Date().toISOString(),
      };

      addedVideos.push(newVideo);
    }

    if (addedVideos.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Eklenen tüm videolar kütüphanede zaten mevcut olduğu için hiçbiri tekrar eklenmedi.",
        addedCount: 0,
        skippedCount,
      });
    }

    // Yeni videoları listenin en başına ekle ve diske yaz
    const updatedLibrary = [...addedVideos, ...currentVideos];
    writeVideosToDisk(updatedLibrary);

    return NextResponse.json({
      success: true,
      message: `${addedVideos.length} yeni video kütüphaneye eklendi. (${skippedCount} mükerrer/geçersiz video atlandı)`,
      addedCount: addedVideos.length,
      skippedCount,
      videos: updatedLibrary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Sunucu hatası: " + err.message }, { status: 500 });
  }
}

// 3. DELETE: Belirtilen videoyu sil (SADECE ADMİN)
export async function DELETE(req: NextRequest) {
  // Yetki Kontrolü
  const token = req.cookies.get("instavault_session")?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json(
      { error: "Yetkisiz işlem: Sadece yönetici video silebilir!" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ error: "Silinecek video ID'si belirtilmedi" }, { status: 400 });
    }

    const currentVideos = readVideosFromDisk();
    const updatedVideos = currentVideos.filter(
      (v) => v.id !== videoId && extractInstagramId(v.url) !== videoId
    );

    if (currentVideos.length === updatedVideos.length) {
      return NextResponse.json({ error: "Video bulunamadı veya zaten silinmiş" }, { status: 404 });
    }

    writeVideosToDisk(updatedVideos);

    return NextResponse.json({
      success: true,
      message: "Video başarıyla kütüphaneden silindi.",
      videos: updatedVideos,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Sunucu hatası: " + err.message }, { status: 500 });
  }
}
