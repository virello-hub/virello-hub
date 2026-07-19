"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const [produse, setProduse] = useState(0);
  const [comenzi, setComenzi] = useState(0);
  const [vanzari, setVanzari] = useState(0);
  const [incarcare, setIncarcare] = useState(true);

  useEffect(() => {
    async function incarcaDate() {
      const [{ count: produseCount }, { data: comenziData, count: comenziCount }] =
        await Promise.all([
          supabase
            .from("produse")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("comenzi")
            .select("total", { count: "exact" }),
        ]);

      setProduse(produseCount || 0);
      setComenzi(comenziCount || 0);

      const total =
        comenziData?.reduce(
          (suma, c) => suma + Number(c.total),
          0
        ) || 0;

      setVanzari(total);
      setIncarcare(false);
    }

    incarcaDate();
  }, []);

  if (incarcare) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Se încarcă...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Dashboard Administrator
      </h1>

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Produse</p>
          <h2 className="mt-2 text-4xl font-bold">
            {produse}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Comenzi</p>
          <h2 className="mt-2 text-4xl font-bold">
            {comenzi}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Vânzări</p>
          <h2 className="mt-2 text-4xl font-bold">
            {vanzari.toFixed(2)} lei
          </h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Link
          href="/admin/produse"
          className="rounded-xl bg-white p-6 text-center shadow transition hover:shadow-lg"
        >
          📦<br />
          <span className="font-semibold">
            Produse
          </span>
        </Link>

        <Link
          href="/admin/comenzi"
          className="rounded-xl bg-white p-6 text-center shadow transition hover:shadow-lg"
        >
          🛒<br />
          <span className="font-semibold">
            Comenzi
          </span>
        </Link>

        <Link
          href="/admin/utilizatori"
          className="rounded-xl bg-white p-6 text-center shadow transition hover:shadow-lg"
        >
          👤<br />
          <span className="font-semibold">
            Utilizatori
          </span>
        </Link>

        <Link
          href="/admin/setari"
          className="rounded-xl bg-white p-6 text-center shadow transition hover:shadow-lg"
        >
          ⚙️<br />
          <span className="font-semibold">
            Setări
          </span>
        </Link>
      </div>
    </main>
  );
}