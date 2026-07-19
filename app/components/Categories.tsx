const categories = [
  {
    name: "Casă & Grădină",
    description: "Produse practice pentru confortul casei tale.",
    icon: "⌂",
  },
  {
    name: "Gadgeturi",
    description: "Accesorii moderne pentru viața de zi cu zi.",
    icon: "◇",
  },
  {
    name: "Auto",
    description: "Produse utile pentru mașină și călătorii.",
    icon: "◉",
  },
  {
    name: "Sport",
    description: "Echipamente și accesorii pentru un stil activ.",
    icon: "△",
  },
  {
    name: "Îngrijire",
    description: "Produse pentru rutină, confort și relaxare.",
    icon: "✦",
  },
  {
    name: "Cadouri",
    description: "Idei inspirate pentru momente speciale.",
    icon: "□",
  },
];

export default function Categories() {
  return (
    <section id="categorii" className="bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c9a96a]">
            Explorează
          </p>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            Categorii populare
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
            Descoperă selecții atent organizate pentru casă, tehnologie,
            lifestyle și multe altele.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className="group rounded-3xl border border-white/10 bg-neutral-950 p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#c9a96a] hover:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl text-[#c9a96a]">
                  {category.icon}
                </span>

                <span className="text-2xl text-neutral-600 transition group-hover:text-[#c9a96a]">
                  →
                </span>
              </div>

              <h3 className="mt-8 text-2xl font-semibold">
                {category.name}
              </h3>

              <p className="mt-3 leading-7 text-neutral-400">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}