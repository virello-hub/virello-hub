"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ComandaConfirmata = {
  id: number;
  nume: string;
  email: string;
  total: number;
  numarProduse: number;
};

export default function ComandaConfirmataPage() {
  const [comanda, setComanda] =
    useState<ComandaConfirmata | null>(null);
  const [incarcat, setIncarcat] = useState(false);

  useEffect(() => {
    try {
      const comandaSalvata =
        sessionStorage.getItem("ultimaComanda");

      if (comandaSalvata) {
        setComanda(JSON.parse(comandaSalvata));
      }
    } catch (error) {
      console.error(
        "Confirmarea comenzii nu a putut fi citită:",
        error
      );
    } finally {
      setIncarcat(true);
    }
  }, []);

  if (!incarcat) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#F7F6F2] px-6 py-16">
        <div className="h-[480px] w-full max-w-2xl animate-pulse rounded-[2rem] bg-white" />
      </main>
    );
  }

  if (!comanda) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#F7F6F2] px-6 py-16 text-[#111111]">
        <div className="w-full max-w-xl rounded-[2rem] border border-[#D4AF37]/20 bg-white p-10 text-center shadow-[0_20px_60px_rgba(17,17,17,0.1)]">
          <h1 className="text-3xl font-bold">
            Confirmarea nu mai este disponibilă
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            Poți reveni la produse pentru a continua cumpărăturile.
          </p>

          <Link
            href="/produse"
            className="mt-8 inline-flex rounded-full bg-[#111111] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#111111]"
          >
            Vezi produsele
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.2),transparent_38%)]" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 bg-white/[0.05] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-4xl text-[#D4AF37]">
          ✓
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
          Comandă înregistrată
        </p>

        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Îți mulțumim, {comanda.nume}!
        </h1>

        <p className="mx-auto mt-5 max-w-lg leading-8 text-gray-400">
          Comanda ta a fost înregistrată cu succes. Datele
          comenzii au fost salvate și pot fi procesate din panoul
          de administrare.
        </p>

        <div className="mt-9 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Număr comandă
            </p>

            <p className="mt-2 text-xl font-bold text-[#D4AF37]">
              #{comanda.id}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Produse
            </p>

            <p className="mt-2 text-xl font-bold">
              {comanda.numarProduse}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total produse
            </p>

            <p className="mt-2 text-xl font-bold">
              {Number(comanda.total).toFixed(2)} lei
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
            </p>

            <p className="mt-2 break-all text-sm font-semibold">
              {comanda.email}
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/produse"
            className="rounded-full border border-[#D4AF37] bg-[#D4AF37] px-7 py-4 text-sm font-bold text-[#111111] transition hover:border-[#E4C45A] hover:bg-[#E4C45A]"
          >
            Continuă cumpărăturile
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Înapoi acasă
          </Link>
        </div>
      </section>
    </main>
  );
}