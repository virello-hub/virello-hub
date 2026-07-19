"use client";

import { useState } from "react";

export default function SetariPage() {
  const [numeMagazin, setNumeMagazin] = useState("Magazinul Meu");
  const [email, setEmail] = useState("contact@magazin.ro");
  const [telefon, setTelefon] = useState("0712 345 678");
  const [mesaj, setMesaj] = useState("");

  function salveazaSetarile() {
    setMesaj("Setările au fost salvate.");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Setări</h1>

        <p className="mt-2 text-gray-500">
          Modifică informațiile magazinului.
        </p>

        <div className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow">
          <div>
            <label className="mb-2 block font-semibold">
              Numele magazinului
            </label>

            <input
              value={numeMagazin}
              onChange={(event) => setNumeMagazin(event.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Telefon
            </label>

            <input
              value={telefon}
              onChange={(event) => setTelefon(event.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="button"
            onClick={salveazaSetarile}
            className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Salvează
          </button>

          {mesaj && (
            <p className="font-semibold text-green-600">
              {mesaj}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}