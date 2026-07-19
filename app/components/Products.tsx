"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import FavoriteButton from "./FavoriteButton";
import { supabase } from "@/lib/supabase/client";

type DatabaseProduct = {
  id: number;
  product_code: string | null;
  slug: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  description: string | null;
  badge: string | null;
  stock: number;
  image_url: string | null;
  active: boolean;
};

type DisplayProduct = {
  id: number;
  product_code: string | null;
  slug: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  description: string | null;
  badge: string | null;
  stock: number;
  image_url: string | null;
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Products() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("cautare")?.trim() || "";

  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toate");
  const [sortOption, setSortOption] = useState("recomandate");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("products")
        .select(
          `
            id,
            product_code,
            slug,
            name,
            category,
            price,
            old_price,
            description,
            badge,
            stock,
            image_url,
            active
          `
        )
        .eq("active", true)
        .order("id", { ascending: false });

      if (error) {
        console.error("Eroare la încărcarea produselor:", error);

        setErrorMessage(
          `Produsele nu au putut fi încărcate: ${error.message}`
        );

        setProducts([]);
        setLoading(false);
        return;
      }

      const loadedProducts = ((data ?? []) as DatabaseProduct[]).map(
        (product) => ({
          id: Number(product.id),
          product_code: product.product_code ?? null,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          old_price:
            product.old_price === null
              ? null
              : Number(product.old_price),
          description: product.description ?? null,
          badge: product.badge ?? null,
          stock: Number(product.stock),
          image_url: product.image_url ?? null,
        })
      );

      setProducts(loadedProducts);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category) => category.trim() !== "")
      )
    ).sort((firstCategory, secondCategory) =>
      firstCategory.localeCompare(secondCategory, "ro")
    );

    return ["Toate", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(searchQuery);

    const result = products.filter((product) => {
      const searchableText = normalizeText(
        [
          product.name,
          product.category,
          product.badge ?? "",
          product.description ?? "",
          product.product_code ?? "",
        ].join(" ")
      );

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "Toate" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((firstProduct, secondProduct) => {
      if (sortOption === "pret-crescator") {
        return firstProduct.price - secondProduct.price;
      }

      if (sortOption === "pret-descrescator") {
        return secondProduct.price - firstProduct.price;
      }

      if (sortOption === "nume-az") {
        return firstProduct.name.localeCompare(
          secondProduct.name,
          "ro"
        );
      }

      if (sortOption === "nume-za") {
        return secondProduct.name.localeCompare(
          firstProduct.name,
          "ro"
        );
      }

      return secondProduct.id - firstProduct.id;
    });
  }, [products, searchQuery, selectedCategory, sortOption]);

  function resetFilters() {
    setSelectedCategory("Toate");
    setSortOption("recomandate");
  }

  if (loading) {
    return (
      <section
        id="produse"
        className="bg-neutral-950 px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-black px-6 py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#D4AF37]" />

            <p className="mt-6 text-neutral-400">
              Se încarcă produsele...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section
        id="produse"
        className="bg-neutral-950 px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-red-300">
              Produsele nu au putut fi încărcate
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-red-200/80">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-[#D4AF37]"
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="produse"
      className="bg-neutral-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
              Selecția VIRELLO
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              {searchQuery
                ? `Rezultate pentru „${searchQuery}”`
                : "Produse recomandate"}
            </h2>

            <p className="mt-4 max-w-2xl text-neutral-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produs disponibil"
                : "produse disponibile"}
            </p>
          </div>

          {searchQuery ? (
            <Link
              href="/Produse"
              className="w-fit rounded-xl border border-[#D4AF37] px-6 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Șterge căutarea
            </Link>
          ) : (
            <button
              type="button"
              onClick={resetFilters}
              className="w-fit rounded-xl border border-[#D4AF37] px-6 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Resetează filtrele
            </button>
          )}
        </div>

        <div className="mb-10 rounded-3xl border border-white/10 bg-black p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-300">
                Filtrează după categorie
              </p>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : "border-white/10 bg-white/5 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="sortare-produse"
                className="mb-3 block text-sm font-semibold text-neutral-300"
              >
                Sortează produsele
              </label>

              <select
                id="sortare-produse"
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
              >
                <option value="recomandate">
                  Produse recomandate
                </option>

                <option value="pret-crescator">
                  Preț: mic spre mare
                </option>

                <option value="pret-descrescator">
                  Preț: mare spre mic
                </option>

                <option value="nume-az">
                  Nume: A–Z
                </option>

                <option value="nume-za">
                  Nume: Z–A
                </option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const favoriteProduct = {
                id: product.id,
                slug: product.slug,
                name: product.name,
                category: product.category,
                price: `${formatPrice(product.price)} lei`,
                oldPrice:
                  product.old_price === null
                    ? ""
                    : `${formatPrice(product.old_price)} lei`,
                badge: product.badge ?? "",
                imageUrl: product.image_url ?? "",
              };

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-black transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950">
                    {product.badge && (
                      <span className="absolute left-4 top-4 z-20 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
                        {product.badge}
                      </span>
                    )}

                    <FavoriteButton product={favoriteProduct} />

                    <Link
                      href={`/produs/${product.slug}`}
                      className="flex h-full w-full items-center justify-center"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center text-neutral-600">
                          <div className="text-6xl">◇</div>

                          <p className="mt-3 text-sm">
                            Imagine produs
                          </p>
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-[#D4AF37]">
                        {product.category}
                      </p>

                      {product.product_code && (
                        <p className="text-xs font-semibold tracking-wider text-neutral-500">
                          {product.product_code}
                        </p>
                      )}
                    </div>

                    <h3 className="mt-2 min-h-14 text-lg font-semibold">
                      {product.name}
                    </h3>

                    {product.stock > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-green-400">
                        În stoc: {product.stock}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-red-400">
                        Stoc epuizat
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="text-xl font-bold">
                        {formatPrice(product.price)} lei
                      </span>

                      {product.old_price !== null &&
                        product.old_price > product.price && (
                          <span className="text-sm text-neutral-500 line-through">
                            {formatPrice(product.old_price)} lei
                          </span>
                        )}
                    </div>

                    <Link
                      href={`/produs/${product.slug}`}
                      className="mt-5 block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black transition group-hover:bg-[#D4AF37]"
                    >
                      Vezi produsul
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-black px-6 py-16 text-center">
            <div className="text-6xl">🔍</div>

            <h3 className="mt-6 text-2xl font-bold">
              Nu am găsit produse
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-neutral-400">
              Nu există produse active care să corespundă căutării sau
              categoriei selectate.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-8 rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-black transition hover:opacity-90"
            >
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </section>
  );
}