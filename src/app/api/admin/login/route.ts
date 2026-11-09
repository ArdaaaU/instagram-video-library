import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";
import crypto from "crypto";

// Bellek içi basit brute-force / hız sınırlaması
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const now = Date.now();

    // Rate Limiting: 5 dakikada 5'ten fazla başarısız deneme varsa engelle
    const record = failedAttempts.get(ip);
    if (record) {
      if (now - record.lastAttempt < 5 * 60 * 1000 && record.count >= 5) {
        return NextResponse.json(
          { error: "Çok fazla başarısız deneme. Lütfen 5 dakika sonra tekrar deneyin." },
          { status: 429 }
        );
      }
      if (now - record.lastAttempt > 5 * 60 * 1000) {
        failedAttempts.delete(ip);
      }
    }

    const body = await req.json();
    const { password } = body;

    // Şifre: Ortam değişkeni varsa onu al, yoksa belirlediğimiz 4519'u kullan
    const expectedPassword = (process.env.ADMIN_PASSWORD || "4519").trim();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Geçersiz şifre girdisi" }, { status: 400 });
    }

    // Güvenli Şifre Karşılaştırması
    const userPassBuffer = Buffer.from(password.trim());
    const expectedPassBuffer = Buffer.from(expectedPassword);

    let isMatch = false;
    if (userPassBuffer.length === expectedPassBuffer.length) {
      isMatch = crypto.timingSafeEqual(userPassBuffer, expectedPassBuffer);
    }

    if (!isMatch) {
      const current = failedAttempts.get(ip) || { count: 0, lastAttempt: now };
      failedAttempts.set(ip, { count: current.count + 1, lastAttempt: now });

      return NextResponse.json({ error: "Hatalı şifre!" }, { status: 401 });
    }

    // Başarılı ise kaydı sıfırla
    failedAttempts.delete(ip);

    // Güvenli oturum belirteci oluştur
    const token = createSessionToken();

    const response = NextResponse.json({ success: true, message: "Giriş başarılı" });

    // VibeSec Kuralı: HttpOnly, Secure, SameSite=Strict Cookie
    response.cookies.set("instavault_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 gün
    });

    return response;
  } catch (err: any) {
    console.error("Login hatası:", err);
    return NextResponse.json({ error: "Giriş işlemi sırasında hata: " + err.message }, { status: 500 });
  }
}
