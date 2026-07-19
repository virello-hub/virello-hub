import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#080808] text-white">

      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#D4AF37]">
              Virello Hub
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
              Calitate.
              <span className="block text-[#D4AF37]">
                Stil. Încredere.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Descoperă produse premium atent selecționate pentru un stil
              modern și elegant.
            </p>

            <div className="mt-10 flex gap-4">

              <Link
                href="/produse"
                className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:bg-[#f0ca55]"
              >
                Descoperă produsele
              </Link>

              <Link
                href="/cont"
                className="rounded-xl border border-[#D4AF37] px-8 py-4 font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
              >
                Contul meu
              </Link>

            </div>
          </div>


          <div className="flex justify-center">

            <div className="flex h-[420px] w-full max-w-md items-center justify-center rounded-[35px] border border-[#D4AF37]/30 bg-gradient-to-br from-black via-[#171717] to-[#3b2d0b] shadow-2xl">

              <div className="text-center">

                <p className="text-5xl font-bold text-[#D4AF37]">
                  VIRELLO
                </p>

                <p className="mt-4 text-gray-400">
                  Premium Collection
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      <section className="bg-white px-6 py-20 text-black">

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">

          <div className="rounded-3xl border p-8">
            <h2 className="text-xl font-bold">
              Livrare rapidă
            </h2>
            <p className="mt-3 text-gray-600">
              Comenzi expediate rapid în România.
            </p>
          </div>


          <div className="rounded-3xl border p-8">
            <h2 className="text-xl font-bold">
              Produse premium
            </h2>
            <p className="mt-3 text-gray-600">
              Calitate și design elegant.
            </p>
          </div>


          <div className="rounded-3xl border p-8">
            <h2 className="text-xl font-bold">
              Plăți sigure
            </h2>
            <p className="mt-3 text-gray-600">
              Comenzi procesate în siguranță.
            </p>
          </div>

        </div>

      </section>


      <section className="px-6 py-20">

        <div className="mx-auto max-w-5xl rounded-[35px] border border-[#D4AF37]/30 bg-[#111] p-12 text-center">

          <h2 className="text-4xl font-bold">
            Descoperă colecția Virello
          </h2>

          <Link
            href="/produse"
            className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black"
          >
            Vezi produsele
          </Link>

        </div>

      </section>


    </main>
  );
}