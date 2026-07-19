"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function ProdusPage() {
  const params = useParams<{ id: string }>();
  const { adaugaInCos } = useCart();

  const [produs, setProdus] = useState<Produs | null>(null);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState("");
  const [adaugat, setAdaugat] = useState(false);

  useEffect(() => {
    async function incarcaProdusul() {
      setIncarcare(true);
      setEroare("");

      const idProdus = Number(params.id);

      if (!Number.isInteger(idProdus) || idProdus <= 0) {
        setEroare("Produsul solicitat nu este valid.");
        setProdus(null);
        setIncarcare(false);
        return;
      }

      const { data, error } = await supabase
        .from("produse")
        .select("id, nume, pret, stoc, activ, imagine_url")
        .eq("id", idProdus)
        .eq("activ", true)
        .maybeSingle();

      if (error) {
        setEroare("Produsul nu a putut fi încărcat.");
        setProdus(null);
      } else if (!data) {
        setEroare("Produsul nu există sau nu mai este disponibil.");
        setProdus(null);
      } else {
        setProdus(data as Produs);
      }

      setIncarcare(false);
    }

    incarcaProdusul();
  }, [params.id]);

  function handleAdaugaInCos() {
    if (!produs || produs.stoc <= 0) {
      return;
    }

    adaugaInCos({
      id: produs.id,
      nume: produs.nume,
      pret: Number(produs.pret),
      imagine_url: produs.imagine_url,
    });

    setAdaugat(true);

    window.setTimeout(() => {
      setAdaugat(false);
    }, 1600);
  }

  if (incarcare) {
    return (
      <main className="min-h-screen bg-[#F7F6F2] px-6 py-14 text-[#111111]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="grid overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(17,17,17,0.1)] lg:grid-cols-2">
            <div className="min-h-[430px] animate-pulse bg-gray-100 lg:min-h-[650px]" />

            <div className="space-y-6 p-8 sm:p-12 lg:p-16">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-gray-100" />
              <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-24 animate-pulse rounded bg-gray-100" />
              <div className="h-14 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (eroare || !produs) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6 py-16 text-[#111111]">
        <div className="w-full max-w-xl rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-[0_20px_60px_rgba(17,17,17,0.1)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-700">
            !
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Produs indisponibil
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            {eroare}
          </p>

          <Link
            href="/produse"
            className="mt-8 inline-flex rounded-full bg-[#111111] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#D4AF37] hover:text-[#111111]"
          >
            Înapoi la produse
          </Link>
        </div>
      </main>
    );
  }

  const esteInStoc = produs.stoc > 0;

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111111]">
      <section className="border-b border-[#D4AF37]/15 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#D4AF37]"
          >
            <span aria-hidden="true">←</span>
            Înapoi la colecție
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        <div className="grid overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_22px_70px_rgba(17,17,17,0.11)] lg:grid-cols-2">
          <div className="relative min-h-[430px] overflow-hidden bg-[#EEECE5] sm:min-h-[560px] lg:min-h-[680px]">
            {produs.imagine_url ? (
              <img
                src={produs.imagine_url}
                alt={produs.nume}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[430px] items-center justify-center p-10 sm:min-h-[560px] lg:min-h-[680px]">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-white text-4xl text-[#D4AF37] shadow-sm">
                    ✦
                  </div>

                  <p className="mt-6 font-medium text-gray-500">
                    Imagine indisponibilă
                  </p>
                </div>
              </div>
            )}

            <span
              className={`absolute left-6 top-6 rounded-full border px-4 py-2 text-xs font-bold shadow-sm backdrop-blur ${
                esteInStoc
                  ? "border-[#D4AF37]/30 bg-white/95 text-[#9A7710]"
                  : "border-white/10 bg-[#111111]/90 text-white"
              }`}
            >
              {esteInStoc ? "Disponibil" : "Stoc epuizat"}
            </span>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B89222]">
              Colecția Virello
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {produs.nume}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <p className="text-3xl font-bold sm:text-4xl">
                {Number(produs.pret).toFixed(2)}
                <span className="ml-2 text-base font-semibold text-gray-500">
                  lei
                </span>
              </p>

              <span className="rounded-full bg-[#F3F2ED] px-4 py-2 text-sm font-semibold text-gray-600">
                Stoc: {produs.stoc}
              </span>
            </div>

            <div className="my-9 h-px bg-gradient-to-r from-[#D4AF37]/50 via-gray-200 to-transparent" />

            <div>
              <h2 className="text-lg font-bold">
                Despre produs
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                Un produs selectat pentru colecția Virello, ales pentru un
                echilibru între calitate, funcționalitate și design elegant.
                Informațiile suplimentare despre produs vor putea fi adăugate
                ulterior din panoul de administrare.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Disponibilitate
                </p>

                <p className="mt-2 font-bold">
                  {esteInStoc
                    ? `${produs.stoc} bucăți în stoc`
                    : "Produs indisponibil"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Livrare
                </p>

                <p className="mt-2 font-bold">
                  Procesare rapidă
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!esteInStoc}
              onClick={handleAdaugaInCos}
              className={`mt-9 w-full rounded-full border px-6 py-4 text-base font-bold transition ${
                !esteInStoc
                  ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-500"
                  : adaugat
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#111111]"
                    : "border-[#111111] bg-[#111111] text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
              }`}
            >
              {!esteInStoc
                ? "Produs indisponibil"
                : adaugat
                  ? "Adăugat în coș ✓"
                  : "Adaugă în coș"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Produsul poate fi eliminat sau cantitatea poate fi modificată
              ulterior din coș.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4AF37]/15 bg-[#0A0A0A]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-bold text-[#D4AF37]">
              Livrare rapidă
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Comenzile sunt procesate cu atenție și pregătite pentru expediere.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-bold text-[#D4AF37]">
              Selecție premium
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Produse alese pentru calitate, utilitate și aspect modern.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-bold text-[#D4AF37]">
              Cumpărături sigure
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              O experiență simplă și transparentă de la produs până la comandă.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}