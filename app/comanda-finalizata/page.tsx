import Link from "next/link";

export default function ComandaFinalizataPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg rounded-xl bg-white p-10 text-center shadow">
        <div className="text-6xl">✓</div>

        <h1 className="mt-4 text-3xl font-bold">
          Comanda a fost trimisă
        </h1>

        <p className="mt-4 text-gray-600">
          Îți mulțumim! Te vom contacta pentru confirmarea comenzii.
        </p>

        <Link
          href="/produse"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
        >
          Înapoi la produse
        </Link>
      </div>
    </main>
  );
}