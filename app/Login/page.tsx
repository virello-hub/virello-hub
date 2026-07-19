"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [incarcare, setIncarcare] = useState(false);
  const [eroare, setEroare] = useState("");

  async function autentificare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIncarcare(true);
    setEroare("");

    const formular = new FormData(event.currentTarget);

    const email = String(formular.get("email") || "").trim();
    const parola = String(formular.get("parola") || "");

    if (!email || !parola) {
      setEroare("Completează emailul și parola.");
      setIncarcare(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: parola,
    });

    if (error) {
      setEroare("Email sau parolă incorectă.");
      setIncarcare(false);
      return;
    }

    router.push("/cont");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Autentificare</h1>

        <p className="mt-2 text-sm text-slate-500">
          Intră în cont pentru a vedea comenzile tale.
        </p>

        <form onSubmit={autentificare} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="parola"
              className="mb-1 block text-sm font-semibold"
            >
              Parolă
            </label>

            <input
              id="parola"
              name="parola"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {eroare && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              {eroare}
            </p>
          )}

          <button
            type="submit"
            disabled={incarcare}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {incarcare ? "Se autentifică..." : "Intră în cont"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Nu ai cont?{" "}
          <Link
            href="/inregistrare"
            className="font-semibold text-slate-900 underline"
          >
            Creează cont
          </Link>
        </p>
      </div>
    </main>
  );
}