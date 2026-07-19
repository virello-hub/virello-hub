"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ProdusComanda = {
  id: number;
  comanda_id: number;
  produs_id: number | null;
  nume_produs: string;
  pret: number;
  cantitate: number;
  imagine_url: string | null;
};

type Comanda = {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  adresa: string;
  oras: string;
  judet: string;
  observatii: string | null;
  metoda_plata: string;
  total: number;
  status: string;
  created_at: string;
  produse: ProdusComanda[];
};

const eticheteStatus: Record<string, string> = {
  noua: "Nouă",
  confirmata: "Confirmată",
  procesare: "În procesare",
  expediata: "Expediată",
  livrata: "Livrată",
  anulata: "Anulată",
};

const claseStatus: Record<string, string> = {
  noua: "bg-blue-100 text-blue-700",
  confirmata: "bg-indigo-100 text-indigo-700",
  procesare: "bg-yellow-100 text-yellow-700",
  expediata: "bg-purple-100 text-purple-700",
  livrata: "bg-emerald-100 text-emerald-700",
  anulata: "bg-red-100 text-red-700",
};

export default function ComenzileMelePage() {
  const router = useRouter();

  const [comenzi, setComenzi] = useState<Comanda[]>([]);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState("");

  useEffect(() => {
    async function incarcaComenzile() {
      setIncarcare(true);
      setEroare("");

      const {
        data: { user },
        error: eroareUtilizator,
      } = await supabase.auth.getUser();

      if (eroareUtilizator || !user) {
        router.push("/login");
        router.refresh();
        return;
      }

      const { data: dateComenzi, error: eroareComenzi } = await supabase
        .from("comenzi")
        .select(
          `
          id,
          nume,
          email,
          telefon,
          adresa,
          oras,
          judet,
          observatii,
          metoda_plata,
          total,
          status,
          created_at
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (eroareComenzi) {
        console.error("Eroare la încărcarea comenzilor:", eroareComenzi);
        setEroare("Comenzile nu au putut fi încărcate.");
        setIncarcare(false);
        return;
      }

      const idsComenzi = (dateComenzi || []).map((comanda) => comanda.id);

      let produseComenzi: ProdusComanda[] = [];

      if (idsComenzi.length > 0) {
        const { data: dateProduse, error: eroareProduse } = await supabase
          .from("produse_comanda")
          .select(
            `
            id,
            comanda_id,
            produs_id,
            nume_produs,
            pret,
            cantitate,
            imagine_url
          `
          )
          .in("comanda_id", idsComenzi)
          .order("created_at", { ascending: true });

        if (eroareProduse) {
          console.error(
            "Eroare la încărcarea produselor comenzilor:",
            eroareProduse
          );
          setEroare("Produsele comenzilor nu au putut fi încărcate.");
          setIncarcare(false);
          return;
        }

        produseComenzi = (dateProduse || []) as ProdusComanda[];
      }

      const comenziComplete: Comanda[] = (dateComenzi || []).map(
        (comanda) => ({
          ...comanda,
          total: Number(comanda.total),
          produse: produseComenzi.filter(
            (produs) => produs.comanda_id === comanda.id
          ),
        })
      );

      setComenzi(comenziComplete);
      setIncarcare(false);
    }

    incarcaComenzile();
  }, [router]);

  function formateazaData(data: string) {
    return new Intl.DateTimeFormat("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data));
  }

  function formateazaPret(valoare: number) {
    return new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valoare);
  }

  if (incarcare) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <p className="text-lg font-medium text-slate-600">
          Se încarcă comenzile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Contul meu
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Comenzile mele
            </h1>

            <p className="mt-2 text-slate-500">
              Vezi istoricul și starea comenzilor tale.
            </p>
          </div>

          <Link
            href="/cont"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-900 transition hover:border-slate-900"
          >
            Înapoi la cont
          </Link>
        </div>

        {eroare && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 font-medium text-red-700">
            {eroare}
          </div>
        )}

        {!eroare && comenzi.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Nu ai încă nicio comandă
            </h2>

            <p className="mt-2 text-slate-500">
              Produsele comandate vor apărea aici.
            </p>

            <Link
              href="/produse"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
            >
              Vezi produsele
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comenzi.map((comanda) => (
            <article
              key={comanda.id}
              className="overflow-hidden rounded-2xl bg-white shadow"
            >
              <div className="border-b border-slate-200 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Comanda #{comanda.id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {formateazaData(comanda.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        claseStatus[comanda.status] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {eticheteStatus[comanda.status] || comanda.status}
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      {formateazaPret(comanda.total)} lei
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Produse
                </h3>

                <div className="mt-4 space-y-4">
                  {comanda.produse.map((produs) => (
                    <div
                      key={produs.id}
                      className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      {produs.imagine_url ? (
                        <img
                          src={produs.imagine_url}
                          alt={produs.nume_produs}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                          Fără imagine
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">
                          {produs.nume_produs}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {produs.cantitate} ×{" "}
                          {formateazaPret(Number(produs.pret))} lei
                        </p>
                      </div>

                      <p className="font-bold text-slate-900">
                        {formateazaPret(
                          Number(produs.pret) * produs.cantitate
                        )}{" "}
                        lei
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Adresa de livrare
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {comanda.adresa}
                    </p>

                    <p className="text-sm text-slate-600">
                      {comanda.oras}, {comanda.judet}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Metoda de plată
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {comanda.metoda_plata === "card"
                        ? "Plată cu cardul"
                        : "Plată ramburs"}
                    </p>
                  </div>
                </div>

                {comanda.observatii && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-500">
                      Observații
                    </p>

                    <p className="mt-1 text-slate-700">
                      {comanda.observatii}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}