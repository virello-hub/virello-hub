"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const estePaginaAdmin = pathname.startsWith("/admin");

  if (estePaginaAdmin) {
    return <>{children}</>;
  }

  function esteLinkActiv(ruta: string) {
    if (ruta === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(ruta);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#D4AF37]/15 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-24 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link
            href="/"
            aria-label="Virello - pagina principală"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/logo-virello.png"
              alt="Logo Virello"
              width={1514}
              height={477}
              priority
              className="h-auto w-36 object-contain sm:w-48 md:w-56"
            />
          </Link>

          <nav
            aria-label="Navigare principală"
            className="flex items-center gap-1 sm:gap-3"
          >
            <Link
              href="/"
              className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition sm:block ${
                esteLinkActiv("/")
                  ? "bg-[#D4AF37]/10 text-[#B89222]"
                  : "text-gray-600 hover:bg-[#D4AF37]/10 hover:text-[#B89222]"
              }`}
            >
              Acasă
            </Link>

            <Link
              href="/produse"
              className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                esteLinkActiv("/produse")
                  ? "bg-[#D4AF37]/10 text-[#B89222]"
                  : "text-gray-600 hover:bg-[#D4AF37]/10 hover:text-[#B89222]"
              }`}
            >
              Produse
            </Link>

            <Link
              href="/cos"
              className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                esteLinkActiv("/cos")
                  ? "bg-[#D4AF37]/10 text-[#B89222]"
                  : "text-gray-600 hover:bg-[#D4AF37]/10 hover:text-[#B89222]"
              }`}
            >
              Coș
            </Link>

            <Link
              href="/cont"
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition sm:px-5 ${
                esteLinkActiv("/cont")
                  ? "border-[#D4AF37] bg-[#D4AF37] text-[#111827]"
                  : "border-[#D4AF37] bg-white text-[#111827] hover:bg-[#D4AF37]"
              }`}
            >
              Cont
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-[#111827] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              aria-label="Virello - pagina principală"
              className="inline-flex rounded-2xl bg-white px-4 py-3"
            >
              <Image
                src="/logo-virello.png"
                alt="Logo Virello"
                width={1514}
                height={477}
                className="h-auto w-48 object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              Produse atent selectate, cumpărături simple și livrare rapidă.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-white">Navigare</h2>

            <div className="mt-4 flex flex-col items-start gap-3">
              <Link
                href="/"
                className="text-sm text-gray-400 transition hover:text-[#D4AF37]"
              >
                Acasă
              </Link>

              <Link
                href="/produse"
                className="text-sm text-gray-400 transition hover:text-[#D4AF37]"
              >
                Produse
              </Link>

              <Link
                href="/cos"
                className="text-sm text-gray-400 transition hover:text-[#D4AF37]"
              >
                Coșul meu
              </Link>

              <Link
                href="/cont"
                className="text-sm text-gray-400 transition hover:text-[#D4AF37]"
              >
                Contul meu
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-white">Magazin online</h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Comandă online în siguranță și urmărește starea comenzilor direct
              din contul tău.
            </p>

            <Link
              href="/produse"
              className="mt-6 inline-flex rounded-full border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#E4C45A]"
            >
              Vezi produsele
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>
              © {new Date().getFullYear()} Virello. Toate drepturile rezervate.
            </p>

            <p>
              Creat cu <span className="text-[#D4AF37]">grijă</span> pentru
              clienți.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}