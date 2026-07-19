"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdaugaProdusPage() {
  const router = useRouter();

  const [nume, setNume] = useState("");
  const [pret, setPret] = useState("");
  const [stoc, setStoc] = useState("");
  const [imagine, setImagine] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function salveaza(e: React.FormEvent) {
    e.preventDefault();

    if (!imagine) {
      alert("Selectează o imagine.");
      return;
    }

    setLoading(true);

    const extensie = imagine.name.split(".").pop();
    const numeFisier = `${Date.now()}.${extensie}`;

    const { error: uploadError } = await supabase.storage
      .from("produse")
      .upload(numeFisier, imagine);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("produse")
      .getPublicUrl(numeFisier);

    const { error } = await supabase.from("produse").insert({
      nume,
      pret: Number(pret),
      stoc: Number(stoc),
      activ: true,
      imagine_url: publicUrl,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/produse");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Adaugă produs
      </h1>

      <form
        onSubmit={salveaza}
        className="space-y-5 rounded-xl bg-white p-6 shadow"
      >
        <input
          type="text"
          placeholder="Nume produs"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="number"
          placeholder="Preț"
          value={pret}
          onChange={(e) => setPret(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="number"
          placeholder="Stoc"
          value={stoc}
          onChange={(e) => setStoc(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImagine(e.target.files ? e.target.files[0] : null)
          }
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 text-white"
        >
          {loading ? "Se salvează..." : "Salvează produsul"}
        </button>
      </form>
    </main>
  );
}