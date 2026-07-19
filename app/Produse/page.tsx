"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";

type Produs = {
  id: number;
  nume: string;
  pret: number;
  stoc: number;
  activ: boolean;
  imagine_url: string | null;
};

export default function ProdusePage() {
  const [produse, setProduse] = useState<Produs[]>([]);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState("");
  const [produsAdaugat, setProdusAdaugat] = useState<number | null>(null);

  const { adaugaInCos } = useCart();

  useEffect(() => {
    async function incarcaProdusele() {
      setIncarcare(true);
      setEroare("");

      const { data, error } = await supabase
        .from("produse")
        .select("id, nume, pret, stoc, activ, imagine_url")
        .eq("activ", true)
        .order("id", { ascending: false });

      if (error) {
        setEroare("Produsele nu au putut fi încărcate.");
        setProduse([]);
      } else {
        setProduse((data || []) as Produs[]);
      }

      setIncarcare(false);
    }

    incarcaProdusele();
  }, []);

  function handleAdaugaInCos(produs: Produs) {
    if (produs.stoc === 0) {
      return;
    }

    adaugaInCos({
      id: produs.id,
      nume: produs.nume,
      pret: Number(produs.pret),
      imagine_url: produs.imagine_url,
    });

    setProdusAdaugat(produs.id);

    window.setTimeout(() => {
      setProdusAdaugat((produsCurent) =>
        produsCurent === produs.id ? null : produsCurent
      );
    }, 1600);
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="relative overflow-hidden border-b border-[#D4AF37]/20 bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_38%)]" />
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <span className="inline-flex items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
            Colecția Virello
          </span>

          <div className="mt-7 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Produse atent alese pentru un stil premium
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                Descoperă selecția Virello, creată pentru calitate, eleganță și
                o experiență de cumpărături modernă.
              </p>
            </div>

            {!incarcare && !eroare && produse.length > 0 && (
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Disponibile acum
                </p>

                <p className="mt-1 text-2xl font-bold text-[#D4AF37]">
                  {produse.length}
                </p>

                <p className="text-sm text-gray-400">
                  {produse.length === 1 ? "produs" : "produse"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        {incarcare && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_16px_45px_rgba(17,17,17,0.08)]"
              >
                <div className="h-72 animate-pulse bg-gray-100" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-7 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-12 animate-pulse rounded-2xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!incarcare && eroare && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-700">
              !
            </div>

            <h2 className="mt-6 text-2xl font-bold text-red-950">
              Nu am putut încărca produsele
            </h2>

            <p className="mt-3 text-red-700">
              {eroare}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 rounded-full bg-[#111111] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#111111]"
            >
              Încearcă din nou
            </button>
          </div>
        )}

        {!incarcare && !eroare && produse.length === 0 && (
          <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#FAFAF8] px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-white text-3xl shadow-sm">
              ✦
            </div>

            <h2 className="mt-7 text-3xl font-bold text-[#111111]">
              Momentan nu există produse
            </h2>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
              Lucrăm la o colecție nouă. Revino în curând pentru a descoperi
              produsele Virello.
            </p>
          </div>
        )}

        {!incarcare && !eroare && produse.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produse.map((produs) => {
              const esteInStoc = produs.stoc > 0;
              const aFostAdaugat = produsAdaugat === produs.id;

              return (
                <article
                  key={produs.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_16px_45px_rgba(17,17,17,0.08)] transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/40 hover:shadow-[0_24px_60px_rgba(17,17,17,0.14)]"
                >
                  <Link
                    href={`/produse/${produs.id}`}
                    className="relative block overflow-hidden bg-[#F7F6F2]"
                    aria-label={`Vezi produsul ${produs.nume}`}
                  >
                    {produs.imagine_url ? (
                      <img
                        src={produs.imagine_url}
                        alt={produs.nume}
                        className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-[#F7F6F2] px-6 text-center">
                        <div>
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-white text-xl text-[#D4AF37]">
                            ✦
                          </div>

                          <p className="mt-4 text-sm font-medium text-gray-400">
                            Fără imagine disponibilă
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition group-hover:opacity-100" />

                    <span
                      className={`absolute left-4 top-4 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${
                        esteInStoc
                          ? "border-[#D4AF37]/30 bg-white/95 text-[#A98518]"
                          : "border-white/10 bg-[#111111]/90 text-white"
                      }`}
                    >
                      {esteInStoc ? "În stoc" : "Stoc epuizat"}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B89222]">
                      Virello
                    </p>

                    <Link
                      href={`/produse/${produs.id}`}
                      className="mt-3 block"
                    >
                      <h2 className="line-clamp-2 text-xl font-bold leading-7 text-[#111111] transition group-hover:text-[#A98518]">
                        {produs.nume}
                      </h2>
                    </Link>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <p className="text-2xl font-bold text-[#111111]">
                        {Number(produs.pret).toFixed(2)}
                        <span className="ml-1 text-sm font-semibold text-gray-500">
                          lei
                        </span>
                      </p>

                      <p className="rounded-full bg-[#F5F5F3] px-3 py-1.5 text-xs font-semibold text-gray-500">
                        Stoc: {produs.stoc}
                      </p>
                    </div>

                    <div className="mt-auto grid gap-3 pt-7">
                      <Link
                        href={`/produse/${produs.id}`}
                        className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-[#111111] transition hover:border-[#D4AF37] hover:text-[#A98518]"
                      >
                        Vezi produsul
                      </Link>

                      <button
                        type="button"
                        disabled={!esteInStoc}
                        onClick={() => handleAdaugaInCos(produs)}
                        className={`w-full rounded-full border px-4 py-3.5 text-sm font-bold transition duration-200 ${
                          !esteInStoc
                            ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-500"
                            : aFostAdaugat
                              ? "border-[#D4AF37] bg-[#D4AF37] text-[#111111]"
                              : "border-[#111111] bg-[#111111] text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                        }`}
                      >
                        {!esteInStoc
                          ? "Indisponibil"
                          : aFostAdaugat
                            ? "Adăugat în coș ✓"
                            : "Adaugă în coș"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-[#D4AF37]/15 bg-[#0A0A0A]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              01
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              Livrare rapidă
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Comenzile sunt procesate rapid și pregătite cu atenție pentru
              fiecare client.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              02
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              Calitate atent aleasă
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Selectăm produse moderne, practice și create pentru o experiență
              premium.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              03
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              Cumpărături sigure
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Datele și comenzile tale sunt gestionate în siguranță, simplu și
              transparent.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}