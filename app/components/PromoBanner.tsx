import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a160c] via-black to-[#0d0d0d]">
        <div className="grid items-center gap-8 px-6 py-10 sm:px-10 md:grid-cols-2 md:py-14 lg:px-16">
          <div>
            <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#D4AF37]">
              Ofertă specială VIRELLO
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Descoperă produse care îți fac viața mai simplă
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-neutral-300">
              Produse moderne, utile și atent selectate, într-o experiență de
              cumpărături simplă și elegantă.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/Produse"
                className="rounded-xl bg-[#D4AF37] px-7 py-3 text-center font-bold text-black transition hover:scale-[1.02] hover:opacity-90"
              >
                Vezi produsele
              </Link>

              <Link
                href="/Despre"
                className="rounded-xl border border-white/15 px-7 py-3 text-center font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Despre VIRELLO
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-72 items-center justify-center">
            <div className="absolute h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="relative rounded-3xl border border-[#D4AF37]/30 bg-black/60 p-10 text-center shadow-2xl">
              <div className="text-7xl">◆</div>

              <p className="mt-5 text-2xl font-bold text-[#D4AF37]">
                VIRELLO
              </p>

              <p className="mt-2 text-sm tracking-widest text-neutral-400">
                CALITATE · STIL · ÎNCREDERE
              </p>
            </div>
          </div>
        </div>

        <div className="grid border-t border-white/10 sm:grid-cols-3">
          <div className="border-b border-white/10 px-6 py-5 text-center sm:border-b-0 sm:border-r">
            <p className="font-semibold text-white">Livrare sigură</p>
            <p className="mt-1 text-sm text-neutral-500">
              Produse livrate cu grijă
            </p>
          </div>

          <div className="border-b border-white/10 px-6 py-5 text-center sm:border-b-0 sm:border-r">
            <p className="font-semibold text-white">Plată protejată</p>
            <p className="mt-1 text-sm text-neutral-500">
              Comenzi simple și sigure
            </p>
          </div>

          <div className="px-6 py-5 text-center">
            <p className="font-semibold text-white">Suport clienți</p>
            <p className="mt-1 text-sm text-neutral-500">
              Suntem aici pentru tine
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}