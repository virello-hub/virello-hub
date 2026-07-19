import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-yellow-700 shadow-2xl">
        <Image
          src="/banner.png"
          alt="Virello Hub"
          width={1600}
          height={700}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}