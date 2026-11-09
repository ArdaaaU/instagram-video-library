import { VideoItem } from "@/types/video";

// Instagram URL'sinden benzersiz gönderi ID'sini (shortcode) ayıklar
// Desteklenenler: /reel/C34vABC/, /p/C34vABC/, ?igsh=xyz, mobil linkler vb.
export function extractInstagramId(url: string): string | null {
  if (!url) return null;
  try {
    const cleanUrl = url.trim();
    const match = cleanUrl.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // Eğer doğrudan ID verilmişse
    if (/^[A-Za-z0-9_-]{8,15}$/.test(cleanUrl)) {
      return cleanUrl;
    }
  } catch {
    return null;
  }
  return null;
}

// Standartlaştırılmış Instagram URL'si üretir
export function normalizeInstagramUrl(url: string): string {
  const id = extractInstagramId(url);
  if (id) {
    return `https://www.instagram.com/reel/${id}/`;
  }
  return url.split("?")[0].replace(/\/+$/, "") + "/";
}

// XSS koruması için metin temizleme
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Güvenli Instagram Embed URL'si üretme
export function formatInstagramEmbedUrl(url: string): string {
  const id = extractInstagramId(url);
  if (id) {
    return `https://www.instagram.com/reel/${id}/embed/captioned/`;
  }
  try {
    const clean = url.split("?")[0].replace(/\/+$/, "");
    return `${clean}/embed/captioned/`;
  } catch {
    return url;
  }
}

// Akıllı kategori tahminleme
export function autoDetectCategory(title: string, caption?: string): string {
  const text = `${title} ${caption || ""}`.toLowerCase();

  if (text.match(/yazılım|kod|python|javascript|react|nextjs|developer|yapay zeka|ai|html|css|sql|api/)) {
    return "Yazılım";
  }
  if (text.match(/yemek|tarif|mutfak|lezzet|pasta|tatlı|makarna|kahve|restoran|börek|çorba/)) {
    return "Yemek";
  }
  if (text.match(/spor|fitness|gym|antrenman|kas|workout|kardiyo|diyet|egzersiz/)) {
    return "Fitness";
  }
  if (text.match(/tasarım|design|figma|ui|ux|mimari|renk|logo|animasyon|3d/)) {
    return "Tasarım";
  }
  if (text.match(/komik|mizah|eğlence|şaka|caps|meme|kahkaha|troll/)) {
    return "Mizah";
  }
  if (text.match(/kitap|tarih|bilgi|öğren|ders|felsefe|psikoloji|ingilizce|dil/)) {
    return "Eğitim";
  }

  return "Genel";
}
