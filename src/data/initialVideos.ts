import { VideoItem } from "@/types/video";

export const initialVideos: VideoItem[] = [
  {
    id: "sample-1",
    url: "https://www.instagram.com/reel/C34vABCDEF/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80",
    title: "Python ile 5 Dakikada Web Scraping Otomasyonu",
    caption: "Veri çekmek hiç bu kadar kolay olmamıştı! BeautifulSoup ve requests kullanarak basit bir otomasyon scripti yapımı. Kodlar profildeki linkte.",
    category: "Yazılım",
    tags: ["python", "otomasyon", "yazılım"],
    addedAt: "2026-11-01T10:00:00Z"
  },
  {
    id: "sample-2",
    url: "https://www.instagram.com/reel/C35vGHIJKL/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
    title: "10 Dakikada Hazırlanan İtalyan Usulü Kremalı Makarna",
    caption: "Hızlı, pratik ve inanılmaz lezzetli akşam yemeği tarifi. Peynir ve sarımsak dengesini mutlaka deneyin!",
    category: "Yemek",
    tags: ["makarna", "tarif", "pratikyemek"],
    addedAt: "2026-11-03T14:30:00Z"
  },
  {
    id: "sample-3",
    url: "https://www.instagram.com/reel/C36vMNOPQR/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80",
    title: "Evde Ekipmansız 15 Dakikalık HIIT Karın Antrenmanı",
    caption: "Metabolizmayı hızlandıran, ekipmansız ve yüksek tempolu kardiyo/karın rutini. Haftada 3 gün uygulayabilirsiniz.",
    category: "Fitness",
    tags: ["fitness", "hiit", "antrenman"],
    addedAt: "2026-11-05T08:15:00Z"
  },
  {
    id: "sample-4",
    url: "https://www.instagram.com/reel/C37vSTUVWX/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80",
    title: "Minimalist UI/UX Tasarım İlkeleri & Renk Seçimleri",
    caption: "Modern web siteleri ve mobil uygulamalar tasarlarken göz yormayan, premium hissettiren renk paletleri.",
    category: "Tasarım",
    tags: ["uiux", "tasarım", "figma"],
    addedAt: "2026-11-07T12:00:00Z"
  },
  {
    id: "sample-5",
    url: "https://www.instagram.com/reel/C38vYZABCD/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80",
    title: "Next.js 14 Server Actions ile API Yazmadan Form Gönderme",
    caption: "API route'lara veda edin! Doğrudan backend fonksiyonunu bileşen içinden tetikleyin.",
    category: "Yazılım",
    tags: ["nextjs", "react", "frontend"],
    addedAt: "2026-11-08T09:20:00Z"
  },
  {
    id: "sample-6",
    url: "https://www.instagram.com/reel/C39vEFGHIJ/",
    type: "video",
    cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80",
    title: "Kedilerin Sahip Olunan Alanı İşgal Etme Komedisi",
    caption: "Çalışırken klavyenin üzerine yatan kedi dostlarımıza özel günün dozu.",
    category: "Mizah",
    tags: ["kedi", "komik", "hayvanlar"],
    addedAt: "2026-11-08T16:45:00Z"
  }
];

export const CATEGORIES = [
  "Tümü",
  "Yazılım",
  "Yemek",
  "Tasarım",
  "Fitness",
  "Mizah",
  "Eğitim",
  "Genel",
  "Favorilerim"
];
