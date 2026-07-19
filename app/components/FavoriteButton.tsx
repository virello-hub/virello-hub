"use client";

import { MouseEvent, useEffect, useState } from "react";

type FavoriteProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  badge: string;
};

type FavoriteButtonProps = {
  product: FavoriteProduct;
};

const FAVORITES_KEY = "virello-favorites";

export default function FavoriteButton({
  product,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);

      if (!savedFavorites) {
        setIsFavorite(false);
        return;
      }

      const favorites: FavoriteProduct[] = JSON.parse(savedFavorites);

      const productIsFavorite = favorites.some(
        (favoriteProduct) => favoriteProduct.id === product.id
      );

      setIsFavorite(productIsFavorite);
    } catch {
      setIsFavorite(false);
    }
  }, [product.id]);

  function toggleFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);

      const favorites: FavoriteProduct[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      const productExists = favorites.some(
        (favoriteProduct) => favoriteProduct.id === product.id
      );

      const updatedFavorites = productExists
        ? favorites.filter(
            (favoriteProduct) => favoriteProduct.id !== product.id
          )
        : [...favorites, product];

      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );

      setIsFavorite(!productExists);

      window.dispatchEvent(
        new Event("virello-favorites-updated")
      );
    } catch {
      setIsFavorite(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={
        isFavorite
          ? "Elimină produsul din favorite"
          : "Adaugă produsul la favorite"
      }
      title={
        isFavorite
          ? "Elimină din favorite"
          : "Adaugă la favorite"
      }
      className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border text-xl transition ${
        isFavorite
          ? "border-[#D4AF37] bg-[#D4AF37] text-black"
          : "border-white/10 bg-black/70 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
      }`}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}