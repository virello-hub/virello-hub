"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Utilizator = {
  email?: string;
  user_metadata?: {
    nume?: string;
  };
};

export default function ContPage() {
  const router = useRouter();

  const [utilizator, setUtilizator] = useState<Utilizator | null>(null);
  const [incarcare, setIncarcare] = useState(true);

  useEffect(() => {
    async function verificaUtilizatorul() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUtilizator(user);
      setIncarcare(false);
    }

    verificaUtilizatorul();
  }, [router]);

  async function iesireDinCont() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (incarcare) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        Se încarcă...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Contul meu
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {utilizator?.user_metadata?.nume || "Utilizator"}
              </h1>

              <p className="mt-2 text-slate-500">
                {utilizator?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={iesireDinCont}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Ieșire din cont
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/cont/comenzi"
              className="rounded-xl border border-slate-200 p-6 transition hover:border-slate-900 hover:shadow"
            >
              <div className="text-3xl">📦</div>

              <h2 className="mt-3 text-xl font-bold">
                Comenzile mele
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Vezi istoricul comenzilor tale.
              </p>
            </Link>

            <Link
              href="/produse"
              className="rounded-xl border border-slate-200 p-6 transition hover:border-slate-900 hover:shadow"
            >
              <div className="text-3xl">🛍️</div>

              <h2 className="mt-3 text-xl font-bold">
                Continuă cumpărăturile
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Revino la lista de produse.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}