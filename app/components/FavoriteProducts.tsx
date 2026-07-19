"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  badge: string;
};

export default function FavoriteProducts() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    loadFavorites();

    window.addEventListener(
      "virello-favorites-updated",
      loadFavorites
    );

    return () => {
      window.removeEventListener(
        "virello-favorites-updated",
        loadFavorites
      );
    };
  }, []);

  function loadFavorites() {
    const saved = localStorage.getItem("virello-favorites");

    if (!saved) {
      setFavorites([]);
      return;
    }

    setFavorites(JSON.parse(saved));
  }

  function removeFavorite(id: number) {
    const updated = favorites.filter((product) => product.id !== id);

    setFavorites(updated);

    localStorage.setItem(
      "virello-favorites",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("virello-favorites-updated")
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="text-6xl">♡</div>

        <h2 className="mt-6 text-2xl font-bold">
          Nu ai produse favorite
        </h2>

        <p className="mt-3 text-neutral-400">
          Apasă pe inimioara unui produs pentru a-l salva aici.
        </p>

        <Link
          href="/Produse"
          className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-black"
        >
          Descoperă produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="rounded-3xl border border-white/10 bg-black p-6"
        >
          <p className="text-sm text-[#D4AF37]">
            {product.category}
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {product.name}
          </h2>

          <p className="mt-4 text-2xl font-bold">
            {product.price}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/produs/${product.slug}`}
              className="rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-black"
            >
              Vezi produsul
            </Link>

            <button
              onClick={() => removeFavorite(product.id)}
              className="rounded-xl border border-red-500 px-5 py-3 text-red-400"
            >
              Elimină
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}