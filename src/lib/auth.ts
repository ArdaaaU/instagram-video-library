import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_default_secure_secret_key_32_bytes_min";

// HMAC-SHA256 ile kurcalanamaz oturum belirteci oluştur
export function createSessionToken(username = "admin"): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

// Belirtecin geçerli ve tahrif edilmemiş olduğunu doğrula
export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payload, signature] = parts;
    const [username, timestampStr] = payload.split(":");
    const timestamp = parseInt(timestampStr, 10);

    // 7 gün geçerlilik süresi
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return false;

    // İmzayı kontrol et
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
