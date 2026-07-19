import Header from "./Header";
import Link from "next/link";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: StaticPageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.35em] text-[#c9a96a]">
          {eyebrow}
        </p>

        <h1 className="mt-5 text-4xl font-bold sm:text-6xl">{title}</h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-400">
          {description}
        </p>

        {children && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-950 p-7 sm:p-10">
            {children}
          </div>
        )}

        <Link
          href="/"
          className="mt-10 inline-flex rounded-xl bg-[#c9a96a] px-6 py-3 font-semibold text-black transition hover:bg-[#d8b979]"
        >
          Înapoi la pagina principală
        </Link>
      </section>
    </main>
  );
}