import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="VIRELLO"
            width={52}
            height={52}
            className="rounded-xl"
          />
          <span className="text-3xl font-extrabold tracking-[0.3em] text-white">
            VIRELLO
          </span>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-neutral-400">🔍</span>
            <input
              type="text"
              placeholder="Caută produse..."
              className="bg-transparent outline-none w-full text-white placeholder-neutral-400"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white">
          <a href="#" className="hover:text-neutral-300">Acasă</a>
          <a href="#" className="hover:text-neutral-300">Produse</a>
          <a href="#" className="hover:text-neutral-300">Categorii</a>
          <a href="#" className="hover:text-neutral-300">Oferte</a>
          <a href="#" className="hover:text-neutral-300">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="border border-neutral-700 rounded-2xl px-4 py-2 text-white hover:border-neutral-500">
            👤 Cont
          </button>
          <button className="rounded-2xl px-5 py-2 font-bold bg-white text-black hover:bg-neutral-200">
            🛒 Coș
          </button>
        </div>
      </div>
    </header>
  );
}