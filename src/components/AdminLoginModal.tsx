"use client";

import React, { useState } from "react";
import { Lock, KeyRound, X, LogOut, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogoutSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLoginSuccess,
  onLogoutSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setPassword("");
        onLoginSuccess();
        onClose();
      } else {
        setErrorMessage(data.error || "Giriş başarısız oldu.");
      }
    } catch {
      setErrorMessage("Sunucu ile bağlantı kurulamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      onLogoutSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Yönetici Paneli</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Yönetici Oturumu Aktif</p>
              <p className="mt-1 text-xs text-zinc-400">
                Şu an yeni video ekleyebilir, silebilir ve toplu JSON aktarabilirsiniz.
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span>Yönetici Çıkışı Yap</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <p className="text-xs text-zinc-400">
              Video eklemek veya kütüphaneyi yönetmek için sunucu tarafında korunan şifrenizi girin.
            </p>

            <div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Yönetici Şifresi"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className={`w-full rounded-xl border bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none ${
                    errorMessage
                      ? "border-red-500 focus:border-red-500"
                      : "border-zinc-800 focus:border-pink-500"
                  }`}
                />
              </div>
              {errorMessage && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-600/20 transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>Giriş Yap</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
