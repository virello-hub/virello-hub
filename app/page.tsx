import Image from "next/image";
import Header from "./components/Header";

const products = [
  { id: 1, name: "Lampă LED Premium", price: "149 lei" },
  { id: 2, name: "Organizator birou", price: "89 lei" },
  { id: 3, name: "Gadget inteligent", price: "199 lei" },
  { id: 4, name: "Accesoriu auto", price: "129 lei" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
          <Image
            src="/banner.png"
            alt="Banner VIRELLO"
            width={1400}
            height={700}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      <section className="text-center py-12 px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-[0.3em] text-white">
          VIRELLO
        </h1>
        <p className="mt-6 text-2xl text-neutral-300">
          Calitate. Stil. Încredere.
        </p>
        <button className="mt-10 px-10 py-4 rounded-2xl font-bold text-lg bg-white text-black hover:bg-neutral-200 transition">
          Vezi Produsele
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Produse recomandate</h2>
          <a href="#" className="text-neutral-300 hover:text-white">Vezi toate</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 hover:border-neutral-600 transition"
            >
              <div className="h-52 bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500 mb-4">
                Imagine produs
              </div>
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-2xl font-extrabold mt-3">{product.price}</p>
              <button className="mt-5 w-full rounded-2xl py-3 font-bold bg-white text-black hover:bg-neutral-200">
                Adaugă în coș
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Casă",
            "Gadgeturi",
            "Auto",
            "Fitness",
            "Animale",
            "Birou",
            "Cadouri",
            "Accesorii",
          ].map((category) => (
            <div
              key={category}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center font-bold hover:border-neutral-600 transition"
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-xl font-bold">Livrare rapidă</h3>
            <p className="text-neutral-400 mt-2">Comenzile ajung rapid la tine.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-bold">Plată securizată</h3>
            <p className="text-neutral-400 mt-2">Datele tale sunt protejate.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <div className="text-3xl mb-3">↩️</div>
            <h3 className="text-xl font-bold">Retur ușor</h3>
            <p className="text-neutral-400 mt-2">Retur în 14 zile.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-400">
          <p className="text-xl font-bold text-white">VIRELLO</p>
          <p className="mt-2">Calitate. Stil. Încredere.</p>
          <p className="mt-4 text-sm">© 2026 VIRELLO. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </main>
  )
}