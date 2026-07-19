"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function InregistrarePage() {
  const router = useRouter();

  const [incarcare, setIncarcare] = useState(false);
  const [eroare, setEroare] = useState("");
  const [mesaj, setMesaj] = useState("");

  async function creeazaCont(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIncarcare(true);
    setEroare("");
    setMesaj("");

    const formular = new FormData(event.currentTarget);

    const nume = String(formular.get("nume") || "").trim();
    const email = String(formular.get("email") || "").trim();
    const parola = String(formular.get("parola") || "");
    const confirmaParola = String(
      formular.get("confirmaParola") || ""
    );

    if (!nume || !email || !parola || !confirmaParola) {
      setEroare("Completează toate câmpurile.");
      setIncarcare(false);
      return;
    }

    if (parola.length < 6) {
      setEroare("Parola trebuie să aibă cel puțin 6 caractere.");
      setIncarcare(false);
      return;
    }

    if (parola !== confirmaParola) {
      setEroare("Parolele nu coincid.");
      setIncarcare(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: parola,
      options: {
        data: {
          nume,
        },
      },
    });

    if (error) {
      setEroare(error.message);
      setIncarcare(false);
      return;
    }

    if (data.session) {
      router.push("/cont");
      router.refresh();
      return;
    }

    setMesaj(
      "Contul a fost creat. Verifică emailul pentru confirmare."
    );

    event.currentTarget.reset();
    setIncarcare(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Creează cont</h1>

        <p className="mt-2 text-sm text-slate-500">
          Creează un cont pentru a vedea comenzile tale.
        </p>

        <form onSubmit={creeazaCont} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="nume"
              className="mb-1 block text-sm font-semibold"
            >
              Nume complet
            </label>

            <input
              id="nume"
              name="nume"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

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
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="confirmaParola"
              className="mb-1 block text-sm font-semibold"
            >
              Confirmă parola
            </label>

            <input
              id="confirmaParola"
              name="confirmaParola"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {eroare && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              {eroare}
            </p>
          )}

          {mesaj && (
            <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              {mesaj}
            </p>
          )}

          <button
            type="submit"
            disabled={incarcare}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {incarcare ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ai deja cont?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline"
          >
            Autentifică-te
          </Link>
        </p>
      </div>
    </main>
  );
}