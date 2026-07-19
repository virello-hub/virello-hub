"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

type CartProduct = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

type FavoriteProduct = {
  id: number;
};

type RewardsSummary = {
  first_name: string | null;
  available_points: number;
  level: string;
};

export default function Header() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [search, setSearch] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [rewards, setRewards] = useState<RewardsSummary | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  function updateCartCount() {
    try {
      const savedCart = window.localStorage.getItem("virello-cart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const cart: CartProduct[] = JSON.parse(savedCart);

      const totalQuantity = cart.reduce(
        (total, product) => total + product.quantity,
        0
      );

      setCartCount(totalQuantity);
    } catch {
      setCartCount(0);
    }
  }

  function updateFavoriteCount() {
    try {
      const savedFavorites = window.localStorage.getItem(
        "virello-favorites"
      );

      if (!savedFavorites) {
        setFavoriteCount(0);
        return;
      }

      const favorites: FavoriteProduct[] = JSON.parse(savedFavorites);

      setFavoriteCount(favorites.length);
    } catch {
      setFavoriteCount(0);
    }
  }

  function updateHeaderCounts() {
    updateCartCount();
    updateFavoriteCount();
  }

  const loadRewards = useCallback(async (currentUser: User | null) => {
    if (!currentUser?.email) {
      setRewards(null);
      return;
    }

    const { data, error } = await supabase
      .from("customer_rewards")
      .select("first_name, available_points, level")
      .eq("email", currentUser.email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Recompensele nu au putut fi încărcate:", error);
      setRewards(null);
      return;
    }

    setRewards(
      data
        ? {
            first_name: data.first_name,
            available_points: Number(data.available_points) || 0,
            level: data.level || "Bronze",
          }
        : null
    );
  }, []);

  useEffect(() => {
    updateHeaderCounts();

    window.addEventListener("storage", updateHeaderCounts);
    window.addEventListener("focus", updateHeaderCounts);
    window.addEventListener(
      "virello-favorites-updated",
      updateFavoriteCount
    );
    window.addEventListener(
      "virello-cart-updated",
      updateCartCount
    );

    return () => {
      window.removeEventListener("storage", updateHeaderCounts);
      window.removeEventListener("focus", updateHeaderCounts);
      window.removeEventListener(
        "virello-favorites-updated",
        updateFavoriteCount
      );
      window.removeEventListener(
        "virello-cart-updated",
        updateCartCount
      );
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      const currentUser = session?.user ?? null;

      setUser(currentUser);
      await loadRewards(currentUser);

      if (active) {
        setAuthLoaded(true);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);
      setAuthLoaded(true);

      setTimeout(() => {
        loadRewards(currentUser);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadRewards]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      router.push("/Produse");
      return;
    }

    router.push(
      `/Produse?cautare=${encodeURIComponent(searchValue)}`
    );
  }

  const accountHref = user ? "/Cont" : "/Login";
  const firstName =
    rewards?.first_name ||
    (typeof user?.user_metadata?.first_name === "string"
      ? user.user_metadata.first_name
      : "");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between gap-5 py-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="VIRELLO"
              width={52}
              height={52}
              className="rounded-full"
              priority
            />

            <span className="hidden text-xl font-bold tracking-[0.28em] sm:block">
              VIRELLO
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:block"
          >
            <div className="relative mx-auto max-w-2xl">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Caută produse..."
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-5 pr-14 text-white outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
              />

              <button
                type="submit"
                aria-label="Caută"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-[#D4AF37] text-black transition hover:opacity-90"
              >
                🔍
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href={accountHref}
              aria-label={user ? "Contul meu" : "Autentificare"}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition hover:border-[#D4AF37]"
            >
              <span className="text-lg">👤</span>

              <span className="hidden text-left lg:block">
                <span className="block text-xs text-neutral-400">
                  {!authLoaded
                    ? "Se încarcă..."
                    : user
                      ? firstName
                        ? `Salut, ${firstName}`
                        : "Contul meu"
                      : "Autentificare"}
                </span>

                {user && (
                  <span className="block text-xs font-bold text-[#D4AF37]">
                    ⭐ {rewards?.available_points ?? 0} puncte
                    {rewards?.level ? ` · ${rewards.level}` : ""}
                  </span>
                )}
              </span>
            </Link>

            <Link
              href="/Favorite"
              aria-label={`Produse favorite: ${favoriteCount}`}
              className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-[#D4AF37] sm:flex"
            >
              <span className="text-xl">
                {favoriteCount > 0 ? "♥" : "♡"}
              </span>

              {favoriteCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-xs font-bold text-black">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <Link
              href="/Cos"
              className="flex h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-4 font-semibold text-black transition hover:opacity-90"
            >
              🛒

              <span className="hidden sm:inline">Coș</span>

              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-4 md:hidden">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Caută produse..."
              className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-4 pr-14 text-white outline-none placeholder:text-neutral-500 focus:border-[#D4AF37]"
            />

            <button
              type="submit"
              aria-label="Caută"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-[#D4AF37] text-black"
            >
              🔍
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-2 overflow-x-auto border-t border-white/10 py-3 text-sm">
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-4 py-2 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            Acasă
          </Link>

          <Link
            href="/#categorii"
            className="whitespace-nowrap rounded-lg px-4 py-2 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            Categorii
          </Link>

          <Link
            href="/Produse"
            className="whitespace-nowrap rounded-lg px-4 py-2 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            Produse
          </Link>

          <Link
            href="/Despre"
            className="whitespace-nowrap rounded-lg px-4 py-2 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            Despre noi
          </Link>

          <Link
            href="/Contact"
            className="whitespace-nowrap rounded-lg px-4 py-2 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}