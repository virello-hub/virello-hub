"use client";

import { useState } from "react";
import StaticPage from "../components/StaticPage";

export default function ContactPage() {
  const [messageSent, setMessageSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessageSent(true);

    (event.target as HTMLFormElement).reset();
  }

  return (
    <StaticPage
      eyebrow="Suntem aici pentru tine"
      title="Contact"
      description="Ai întrebări despre produse, comenzi sau livrare? Echipa VIRELLO este pregătită să te ajute."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            Date de contact
          </h2>

          <div className="space-y-5 text-neutral-300">
            <div>
              <p className="font-semibold text-[#D4AF37]">
                📧 Email
              </p>

              <p>contact@virello.ro</p>
            </div>

            <div>
              <p className="font-semibold text-[#D4AF37]">
                📞 Telefon
              </p>

              <p>+40 700 000 000</p>
            </div>

            <div>
              <p className="font-semibold text-[#D4AF37]">
                🕒 Program
              </p>

              <p>Luni - Vineri</p>
              <p>09:00 - 18:00</p>
            </div>

            <div>
              <p className="font-semibold text-[#D4AF37]">
                📍 Locație
              </p>

              <p>România</p>
            </div>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="grid gap-5"
          >
            <input
              type="text"
              placeholder="Numele tău"
              required
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
            />

            <input
              type="email"
              placeholder="Adresa de e-mail"
              required
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
            />

            <input
              type="text"
              placeholder="Subiect"
              required
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
            />

            <textarea
              rows={6}
              placeholder="Mesajul tău..."
              required
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-black transition hover:opacity-90"
            >
              Trimite mesajul
            </button>

            {messageSent && (
              <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-green-400">
                ✅ Mesajul a fost trimis cu succes. Îți vom răspunde în cel mai scurt timp.
              </div>
            )}
          </form>
        </div>
      </div>
    </StaticPage>
  );
}