"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [parola, setParola] = useState("");
  const [eroare, setEroare] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setEroare("");

    const emailNormalizat = email.trim().toLowerCase();

    if (emailNormalizat !== ADMIN_EMAIL.toLowerCase()) {
      setEroare("Acest cont nu are acces la administrare.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailNormalizat,
      password: parola,
    });

    if (error || !data.user) {
      setEroare("Email sau parolă incorectă.");
      setLoading(false);
      return;
    }

    const esteAdministrator =
      data.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (!esteAdministrator) {
      await supabase.auth.signOut();

      setEroare("Acest cont nu are acces la administrare.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl" />

      <form
        onSubmit={login}
        className="relative w-full max-w-md rounded-3xl border border-[#D4AF37]/40 bg-white p-8 shadow-2xl sm:p-10"
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#B8941F]">
            Virello Hub
          </p>

          <h1 className="text-3xl font-bold text-black">
            Administrare
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Conectează-te pentru a administra magazinul.
          </p>
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="parola"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Parolă
          </label>

          <input
            id="parola"
            type="password"
            autoComplete="current-password"
            placeholder="Introdu parola"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            required
          />
        </div>

        {eroare && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {eroare}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-black transition hover:bg-[#E4C45A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Se conectează..." : "Conectare"}
        </button>

        <a
          href="/"
          className="mt-5 block text-center text-sm font-medium text-gray-500 transition hover:text-[#B8941F]"
        >
          Înapoi la magazin
        </a>
      </form>
    </main>
  );
}