"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CosPage() {
  const {
    produseCos,
    incarcat,
    stergeDinCos,
    schimbaCantitatea,
    golesteCosul,
    totalProduse,
    totalPret,
  } = useCart();

  if (!incarcat) {
    return (
      <main className="min-h-screen bg-[#F7F6F2] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="h-12 w-64 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-3xl bg-white"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (produseCos.length === 0) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#F7F6F2] px-6 py-16 text-[#111111]">
        <div className="w-full max-w-2xl rounded-[2rem] border border-[#D4AF37]/20 bg-white px-7 py-16 text-center shadow-[0_20px_60px_rgba(17,17,17,0.1)] sm:px-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-3xl text-[#B89222]">
            ✦
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-[#B89222]">
            Virello Hub
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Coșul tău este gol
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
            Descoperă colecția noastră și adaugă produsele preferate
            în coș.
          </p>

          <Link
            href="/produse"
            className="mt-8 inline-flex rounded-full border border-[#111111] bg-[#111111] px-8 py-4 text-sm font-bold text-white transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
          >
            Vezi produsele
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111111]">
      <section className="border-b border-[#D4AF37]/15 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#D4AF37]"
          >
            <span aria-hidden="true">←</span>
            Continuă cumpărăturile
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                Comanda ta
              </p>

              <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
                Coșul meu
              </h1>
            </div>

            <p className="text-sm text-gray-400">
              {totalProduse}{" "}
              {totalProduse === 1 ? "produs" : "produse"} în coș
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Produse selectate
              </h2>

              <button
                type="button"
                onClick={golesteCosul}
                className="text-sm font-semibold text-red-600 transition hover:text-red-800"
              >
                Golește coșul
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {produseCos.map((produs) => (
                <article
                  key={produs.id}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,0.07)] sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <Link
                      href={`/produse/${produs.id}`}
                      className="block shrink-0 overflow-hidden rounded-2xl bg-[#F4F3EE]"
                    >
                      {produs.imagine_url ? (
                        <img
                          src={produs.imagine_url}
                          alt={produs.nume}
                          className="h-44 w-full object-cover transition hover:scale-105 sm:h-32 sm:w-32"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center text-sm font-medium text-gray-400 sm:h-32 sm:w-32">
                          Fără imagine
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B89222]">
                        Virello
                      </p>

                      <Link href={`/produse/${produs.id}`}>
                        <h2 className="mt-2 text-xl font-bold transition hover:text-[#A98518]">
                          {produs.nume}
                        </h2>
                      </Link>

                      <p className="mt-2 text-sm text-gray-500">
                        {Number(produs.pret).toFixed(2)} lei / bucată
                      </p>

                      <button
                        type="button"
                        onClick={() => stergeDinCos(produs.id)}
                        className="mt-4 text-sm font-semibold text-red-600 transition hover:text-red-800"
                      >
                        Elimină produsul
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="flex items-center rounded-full border border-gray-200 bg-[#FAFAF8] p-1">
                        <button
                          type="button"
                          aria-label={`Scade cantitatea pentru ${produs.nume}`}
                          onClick={() =>
                            schimbaCantitatea(
                              produs.id,
                              produs.cantitate - 1
                            )
                          }
                          disabled={produs.cantitate <= 1}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium transition hover:bg-white disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center font-bold">
                          {produs.cantitate}
                        </span>

                        <button
                          type="button"
                          aria-label={`Crește cantitatea pentru ${produs.nume}`}
                          onClick={() =>
                            schimbaCantitatea(
                              produs.id,
                              produs.cantitate + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium transition hover:bg-white"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-xl font-bold">
                        {(
                          Number(produs.pret) * produs.cantitate
                        ).toFixed(2)}{" "}
                        <span className="text-sm font-semibold text-gray-500">
                          lei
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#D4AF37]/20 bg-[#0A0A0A] p-7 text-white shadow-[0_20px_60px_rgba(17,17,17,0.15)] lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Rezumat comandă
            </p>

            <div className="mt-7 space-y-4 border-b border-white/10 pb-6 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">
                  Produse ({totalProduse})
                </span>

                <span className="font-semibold">
                  {totalPret.toFixed(2)} lei
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">
                  Livrare
                </span>

                <span className="font-semibold text-[#D4AF37]">
                  Se confirmă telefonic
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 py-7">
              <span className="text-lg font-semibold">
                Total produse
              </span>

              <span className="text-3xl font-bold text-[#D4AF37]">
                {totalPret.toFixed(2)}
                <span className="ml-1 text-sm">lei</span>
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-full border border-[#D4AF37] bg-[#D4AF37] px-5 py-4 text-center text-sm font-bold text-[#111111] transition hover:border-[#E4C45A] hover:bg-[#E4C45A]"
            >
              Continuă către checkout
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              Datele de livrare vor fi completate la pasul următor.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}