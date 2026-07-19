"use client";

import { useState } from "react";

type Utilizator = {
  id: number;
  nume: string;
  email: string;
  rol: "Client" | "Admin";
  status: "Activ" | "Blocat";
};

const utilizatoriInitiali: Utilizator[] = [
  {
    id: 1,
    nume: "Andrei Popescu",
    email: "andrei@email.com",
    rol: "Client",
    status: "Activ",
  },
  {
    id: 2,
    nume: "Maria Ionescu",
    email: "maria@email.com",
    rol: "Client",
    status: "Activ",
  },
  {
    id: 3,
    nume: "Administrator",
    email: "admin@email.com",
    rol: "Admin",
    status: "Activ",
  },
];

export default function UtilizatoriPage() {
  const [utilizatori, setUtilizatori] = useState(utilizatoriInitiali);

  function schimbaStatus(id: number) {
    setUtilizatori((lista) =>
      lista.map((utilizator) =>
        utilizator.id === id
          ? {
              ...utilizator,
              status: utilizator.status === "Activ" ? "Blocat" : "Activ",
            }
          : utilizator
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">Utilizatori</h1>

        <p className="mb-8 text-gray-500">
          Administrează utilizatorii magazinului.
        </p>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Nume</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Status</th>
                <th className="p-4">Acțiune</th>
              </tr>
            </thead>

            <tbody>
              {utilizatori.map((utilizator) => (
                <tr key={utilizator.id} className="border-t">
                  <td className="p-4 font-semibold">{utilizator.nume}</td>

                  <td className="p-4 text-gray-600">{utilizator.email}</td>

                  <td className="p-4">{utilizator.rol}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        utilizator.status === "Activ"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {utilizator.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => schimbaStatus(utilizator.id)}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                      {utilizator.status === "Activ"
                        ? "Blochează"
                        : "Deblochează"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}