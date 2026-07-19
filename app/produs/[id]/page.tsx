import Link from "next/link";
import { notFound } from "next/navigation";

import AddToCartButton from "../../components/AddToCartButton";
import FavoriteButton from "../../components/FavoriteButton";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Product = {
  id: number;
  product_code: string | null;
  slug: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  description: string | null;
  stock: number;
  image_url: string | null;
  active: boolean;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function createFavoriteProduct(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: `${formatPrice(product.price)} lei`,
    oldPrice:
      product.old_price !== null
        ? `${formatPrice(product.old_price)} lei`
        : "",
    badge: product.badge ?? "",
    imageUrl: product.image_url ?? "",
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const decodedSlug = decodeURIComponent(id);

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
        badge,
        description,
        stock,
        image_url,
        active
      `
    )
    .eq("slug", decodedSlug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Eroare la încărcarea produsului:", error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const product: Product = {
    id: Number(data.id),
    product_code: data.product_code ?? null,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    old_price:
      data.old_price === null || data.old_price === undefined
        ? null
        : Number(data.old_price),
    badge: data.badge ?? null,
    description:
      data.description?.trim() ||
      "Acest produs a fost atent selectat pentru magazinul VIRELLO.",
    stock: Number(data.stock ?? 0),
    image_url: data.image_url ?? null,
    active: Boolean(data.active),
  };

  const { data: relatedData } = await supabase
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
        badge,
        description,
        stock,
        image_url,
        active
      `
    )
    .eq("active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const relatedProducts: Product[] = (relatedData ?? []).map(
    (relatedProduct) => ({
      id: Number(relatedProduct.id),
      product_code: relatedProduct.product_code ?? null,
      slug: relatedProduct.slug,
      name: relatedProduct.name,
      category: relatedProduct.category,
      price: Number(relatedProduct.price),
      old_price:
        relatedProduct.old_price === null ||
        relatedProduct.old_price === undefined
          ? null
          : Number(relatedProduct.old_price),
      badge: relatedProduct.badge ?? null,
      description: relatedProduct.description ?? null,
      stock: Number(relatedProduct.stock ?? 0),
      image_url: relatedProduct.image_url ?? null,
      active: Boolean(relatedProduct.active),
    })
  );

  const favoriteProduct = createFavoriteProduct(product);
  const formattedPrice = `${formatPrice(product.price)} lei`;

  const formattedOldPrice =
    product.old_price !== null
      ? `${formatPrice(product.old_price)} lei`
      : null;

  const hasDiscount =
    product.old_price !== null &&
    product.old_price > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.old_price! - product.price) /
          product.old_price!) *
          100
      )
    : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-5 text-sm text-neutral-400">
          <Link
            href="/"
            className="transition hover:text-[#D4AF37]"
          >
            Acasă
          </Link>

          <span>/</span>

          <Link
            href="/Produse"
            className="transition hover:text-[#D4AF37]"
          >
            Produse
          </Link>

          <span>/</span>

          <span className="text-white">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-950 sm:min-h-[560px]">
              {product.badge && (
                <span className="absolute left-5 top-5 z-20 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black">
                  {product.badge}
                </span>
              )}

              <FavoriteButton product={favoriteProduct} />

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-neutral-600">
                  <div className="text-8xl">◇</div>

                  <p className="mt-4 text-sm">
                    Imaginea produsului nu este disponibilă
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-3xl text-neutral-700 transition hover:border-[#D4AF37]/60"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={`${product.name} - imagine ${item}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>◇</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                {product.category}
              </p>

              {product.product_code && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-neutral-400">
                  Cod: {product.product_code}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="text-[#D4AF37]">
                ★ ★ ★ ★ ★
              </div>

              <p className="text-sm text-neutral-400">
                Produs selectat de VIRELLO
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p className="text-4xl font-bold text-[#D4AF37]">
                {formattedPrice}
              </p>

              {hasDiscount && formattedOldPrice && (
                <>
                  <p className="text-lg text-neutral-500 line-through">
                    {formattedOldPrice}
                  </p>

                  {discountPercentage !== null && (
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-bold text-red-400">
                      -{discountPercentage}%
                    </span>
                  )}
                </>
              )}
            </div>

            {product.stock > 0 ? (
              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                În stoc: {product.stock} buc.
              </div>
            ) : (
              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Stoc epuizat
              </div>
            )}

            <p className="mt-8 whitespace-pre-line leading-8 text-neutral-300">
              {product.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-950 p-5">
              <p className="font-semibold text-white">
                Ce primești:
              </p>

              <ul className="mt-4 space-y-3 text-sm text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-[#D4AF37]">✓</span>
                  Produs atent selectat
                </li>

                <li className="flex gap-3">
                  <span className="text-[#D4AF37]">✓</span>
                  Ambalare sigură pentru transport
                </li>

                <li className="flex gap-3">
                  <span className="text-[#D4AF37]">✓</span>
                  Asistență pentru comanda ta
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {product.stock > 0 ? (
                <AddToCartButton
                  id={product.slug}
                  name={product.name}
                  price={formattedPrice}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-neutral-800 px-6 py-4 font-bold text-neutral-500"
                >
                  Produs indisponibil
                </button>
              )}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div className="text-2xl">🚚</div>

                <p className="mt-3 font-semibold">
                  Livrare sigură
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Expediere cu grijă
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div className="text-2xl">🔒</div>

                <p className="mt-3 font-semibold">
                  Plată protejată
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Comandă în siguranță
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <div className="text-2xl">↩️</div>

                <p className="mt-3 font-semibold">
                  Retur simplu
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Conform condițiilor
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-neutral-950 p-7">
            <h2 className="text-xl font-bold text-[#D4AF37]">
              Descriere
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-neutral-400">
              {product.description}
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-950 p-7">
            <h2 className="text-xl font-bold text-[#D4AF37]">
              Livrare
            </h2>

            <p className="mt-4 leading-7 text-neutral-400">
              Comenzile sunt pregătite și expediate în condiții
              de siguranță. Perioada exactă de livrare va fi
              afișată înainte de finalizarea comenzii.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-950 p-7">
            <h2 className="text-xl font-bold text-[#D4AF37]">
              Retur
            </h2>

            <p className="mt-4 leading-7 text-neutral-400">
              Produsele eligibile pot fi returnate în termenul
              prevăzut în politica magazinului și în legislația
              aplicabilă.
            </p>
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
                Recomandări
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Produse similare
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <article
                  key={relatedProduct.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 transition hover:-translate-y-1 hover:border-[#D4AF37]/60"
                >
                  <Link href={`/produs/${relatedProduct.slug}`}>
                    <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950">
                      {relatedProduct.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
                          {relatedProduct.badge}
                        </span>
                      )}

                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center text-neutral-600">
                          <div className="text-5xl">◇</div>

                          <p className="mt-3 text-xs">
                            Imagine produs
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-[#D4AF37]">
                        {relatedProduct.category}
                      </p>

                      <h3 className="mt-2 min-h-14 text-lg font-semibold">
                        {relatedProduct.name}
                      </h3>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-xl font-bold">
                          {formatPrice(relatedProduct.price)} lei
                        </span>

                        {relatedProduct.old_price !== null &&
                          relatedProduct.old_price >
                            relatedProduct.price && (
                            <span className="text-sm text-neutral-500 line-through">
                              {formatPrice(
                                relatedProduct.old_price
                              )}{" "}
                              lei
                            </span>
                          )}
                      </div>

                      <span className="mt-5 block rounded-xl bg-white px-4 py-3 text-center font-semibold text-black transition group-hover:bg-[#D4AF37]">
                        Vezi produsul
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}