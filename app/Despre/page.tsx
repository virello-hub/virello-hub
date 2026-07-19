import StaticPage from "../components/StaticPage";

export default function DesprePage() {
  return (
    <StaticPage
      eyebrow="Povestea noastră"
      title="Despre VIRELLO"
      description="Descoperă cine suntem și de ce ne dorim să oferim o experiență de cumpărături modernă, sigură și simplă."
    >
      <div className="space-y-10 text-neutral-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#D4AF37]">
            Calitate. Stil. Încredere.
          </h2>

          <p className="leading-8">
            VIRELLO este un magazin online dedicat persoanelor care își doresc
            produse moderne, utile și atent alese. Ne concentrăm pe calitate,
            design și o experiență de cumpărături cât mai simplă și plăcută.
          </p>

          <p className="leading-8">
            Indiferent dacă ești în căutarea unui gadget inteligent, a unui
            accesoriu pentru casă sau a unui cadou inspirat, obiectivul nostru
            este să îți oferim produse care îți fac viața mai ușoară.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#D4AF37]">
              🚚 Livrare
            </h3>

            <p>
              Colaborăm cu parteneri de încredere pentru ca produsele să ajungă
              rapid și în siguranță la tine.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#D4AF37]">
              ⭐ Calitate
            </h3>

            <p>
              Selectăm produse care oferă un raport foarte bun între calitate,
              utilitate și preț.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#D4AF37]">
              🤝 Suport
            </h3>

            <p>
              Echipa noastră este disponibilă pentru a răspunde întrebărilor și
              pentru a te ajuta înainte și după plasarea unei comenzi.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-8">
          <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
            Misiunea noastră
          </h2>

          <p className="leading-8">
            Ne propunem să construim un magazin online în care fiecare client să
            cumpere cu încredere. Punem accent pe transparență, produse atent
            selectate și o experiență de utilizare modernă, atât pe calculator,
            cât și pe telefon.
          </p>
        </section>
      </div>
    </StaticPage>
  );
}