"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

type CartProduct = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  city: string;
  streetAddress: string;
  addressDetails: string;
  notes: string;
};

type CreatedOrder = {
  id: string;
  order_number: number;
  earnedPoints: number;
  totalPoints: number;
  level: RewardLevel;
  nextLevel: RewardLevel | null;
  pointsUntilNextLevel: number;
  hasFreeDelivery: boolean;
  hasSurpriseGift: boolean;
};

type RewardLevel = "Bronze" | "Silver" | "Gold" | "Diamond";

type CustomerRewards = {
  total_points: number;
  available_points: number;
  lifetime_spent: number | string;
  orders_count: number;
  gifts_received: number;
};

const initialForm: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  county: "",
  city: "",
  streetAddress: "",
  addressDetails: "",
  notes: "",
};

const FREE_DELIVERY_THRESHOLD = 249.99;
const SURPRISE_GIFT_THRESHOLD = 299.99;
const DELIVERY_PRICE = 19.99;

function calculateLoyaltyPoints(value: number) {
  return Math.floor(value / 10);
}

function getRewardLevel(points: number): RewardLevel {
  if (points >= 5000) return "Diamond";
  if (points >= 1500) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}

function getNextLevel(points: number) {
  if (points < 500) {
    return {
      level: "Silver" as RewardLevel,
      pointsUntilNextLevel: 500 - points,
    };
  }

  if (points < 1500) {
    return {
      level: "Gold" as RewardLevel,
      pointsUntilNextLevel: 1500 - points,
    };
  }

  if (points < 5000) {
    return {
      level: "Diamond" as RewardLevel,
      pointsUntilNextLevel: 5000 - points,
    };
  }

  return {
    level: null,
    pointsUntilNextLevel: 0,
  };
}

function getLevelIcon(level: RewardLevel) {
  if (level === "Diamond") return "💎";
  if (level === "Gold") return "🥇";
  if (level === "Silver") return "🥈";
  return "🥉";
}

function priceToNumber(price: string) {
  const normalizedPrice = price
    .replace(/\s/g, "")
    .replace(/lei/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsedPrice = Number(normalizedPrice);

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function formatPrice(price: number) {
  return `${price.toFixed(2).replace(".", ",")} lei`;
}

function isValidCartProduct(value: unknown): value is CartProduct {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Partial<CartProduct>;

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "string" &&
    typeof product.quantity === "number" &&
    Number.isFinite(product.quantity) &&
    product.quantity > 0
  );
}

export default function ComandaPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [form, setForm] = useState<CustomerForm>(initialForm);

  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("virello-cart");

    if (savedCart) {
      try {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart.filter(isValidCartProduct));
        }
      } catch (error) {
        console.error("Coșul nu a putut fi citit:", error);
        localStorage.removeItem("virello-cart");
      }
    }

    setLoaded(true);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, product) =>
        total + priceToNumber(product.price) * product.quantity,
      0,
    );
  }, [cart]);

  const hasFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const hasSurpriseGift = subtotal >= SURPRISE_GIFT_THRESHOLD;
  const delivery = hasFreeDelivery ? 0 : DELIVERY_PRICE;
  const total = subtotal + delivery;
  const loyaltyPoints = calculateLoyaltyPoints(subtotal);

  function updateForm(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || cart.length === 0) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const normalizedEmail = form.email.trim().toLowerCase();

    const orderItems = cart.map((product) => ({
      product_id: product.id,
      name: product.name,
      unit_price: priceToNumber(product.price),
      displayed_price: product.price,
      quantity: product.quantity,
      line_total: priceToNumber(product.price) * product.quantity,
    }));

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: normalizedEmail,
        phone: form.phone.trim(),

        county: form.county.trim(),
        city: form.city.trim(),
        street_address: form.streetAddress.trim(),
        address_details: form.addressDetails.trim() || null,

        payment_method: "cash_on_delivery",
        notes: form.notes.trim() || null,

        items: orderItems,

        subtotal: Number(subtotal.toFixed(2)),
        delivery_cost: Number(delivery.toFixed(2)),
        total: Number(total.toFixed(2)),

        status: "noua",
      })
      .select("id, order_number")
      .single();

    if (orderError || !orderData) {
      console.error("Comanda nu a putut fi salvată:", orderError);

      setErrorMessage(
        "Comanda nu a putut fi trimisă. Verifică datele și încearcă din nou.",
      );

      setSubmitting(false);
      return;
    }

    const { data: existingRewards, error: rewardsReadError } = await supabase
      .from("customer_rewards")
      .select(
        "total_points, available_points, lifetime_spent, orders_count, gifts_received",
      )
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (rewardsReadError) {
      console.error(
        "Contul VIRELLO Rewards nu a putut fi citit:",
        rewardsReadError,
      );
    }

    const rewards = existingRewards as CustomerRewards | null;

    const previousTotalPoints = rewards?.total_points ?? 0;
    const previousAvailablePoints = rewards?.available_points ?? 0;
    const previousLifetimeSpent = Number(rewards?.lifetime_spent ?? 0);
    const previousOrdersCount = rewards?.orders_count ?? 0;
    const previousGiftsReceived = rewards?.gifts_received ?? 0;

    const newTotalPoints = previousTotalPoints + loyaltyPoints;
    const newAvailablePoints = previousAvailablePoints + loyaltyPoints;
    const newLifetimeSpent = previousLifetimeSpent + subtotal;
    const newOrdersCount = previousOrdersCount + 1;
    const newGiftsReceived = previousGiftsReceived + (hasSurpriseGift ? 1 : 0);
    const newLevel = getRewardLevel(newTotalPoints);
    const nextLevelDetails = getNextLevel(newTotalPoints);

    const { error: rewardsSaveError } = await supabase
      .from("customer_rewards")
      .upsert(
        {
          email: normalizedEmail,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          total_points: newTotalPoints,
          available_points: newAvailablePoints,
          lifetime_spent: Number(newLifetimeSpent.toFixed(2)),
          orders_count: newOrdersCount,
          gifts_received: newGiftsReceived,
          level: newLevel,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
        },
      );

    if (rewardsSaveError) {
      console.error(
        "Punctele VIRELLO Rewards nu au putut fi salvate:",
        rewardsSaveError,
      );

      setErrorMessage(
        "Comanda a fost înregistrată, dar punctele nu au putut fi actualizate automat. Contactează-ne și le vom adăuga manual.",
      );
    }

    localStorage.removeItem("virello-cart");
    window.dispatchEvent(new Event("virello-cart-updated"));

    setCart([]);
    setForm(initialForm);
    setCreatedOrder({
      id: orderData.id,
      order_number: orderData.order_number,
      earnedPoints: loyaltyPoints,
      totalPoints: rewardsSaveError ? previousTotalPoints : newTotalPoints,
      level: rewardsSaveError ? getRewardLevel(previousTotalPoints) : newLevel,
      nextLevel: rewardsSaveError
        ? getNextLevel(previousTotalPoints).level
        : nextLevelDetails.level,
      pointsUntilNextLevel: rewardsSaveError
        ? getNextLevel(previousTotalPoints).pointsUntilNextLevel
        : nextLevelDetails.pointsUntilNextLevel,
      hasFreeDelivery,
      hasSurpriseGift,
    });
    setSubmitting(false);
  }

  if (!loaded) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-center text-neutral-400">
          Se încarcă pagina comenzii...
        </p>
      </section>
    );
  }

  if (createdOrder) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-neutral-900 p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37] text-4xl font-bold text-black">
            ✓
          </div>

          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
            VIRELLO
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Comanda a fost înregistrată
          </h1>

          <p className="mt-5 text-lg text-neutral-300">
            Numărul comenzii tale este:
          </p>

          <p className="mt-2 text-3xl font-bold text-[#D4AF37]">
            #{createdOrder.order_number}
          </p>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-400">
            Am primit comanda și datele de livrare. Te vom contacta pentru
            confirmare înainte de expediere.
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5">
              <p className="text-sm uppercase tracking-wider text-[#D4AF37]">
                Ai câștigat
              </p>
              <p className="mt-2 text-3xl font-bold">
                ⭐ {createdOrder.earnedPoints} puncte
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm uppercase tracking-wider text-neutral-400">
                Nivelul tău
              </p>
              <p className="mt-2 text-3xl font-bold">
                {getLevelIcon(createdOrder.level)} {createdOrder.level}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-400">Total puncte disponibile</span>
              <strong className="text-[#D4AF37]">
                {createdOrder.totalPoints} puncte
              </strong>
            </div>

            {createdOrder.nextLevel ? (
              <p className="mt-3 text-sm text-neutral-400">
                Mai ai{" "}
                <strong className="text-white">
                  {createdOrder.pointsUntilNextLevel} puncte
                </strong>{" "}
                până la nivelul {createdOrder.nextLevel}.
              </p>
            ) : (
              <p className="mt-3 text-sm text-neutral-400">
                Ai atins cel mai înalt nivel VIRELLO Rewards.
              </p>
            )}
          </div>

          <div className="mx-auto mt-4 max-w-xl space-y-3 text-left">
            {createdOrder.hasFreeDelivery && (
              <p className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
                🚚 Transport gratuit inclus în comandă.
              </p>
            )}

            {createdOrder.hasSurpriseGift && (
              <p className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-4 text-purple-200">
                🎁 Comanda ta include un cadou surpriză VIRELLO.
              </p>
            )}
          </div>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-500">
            Punctele sunt asociate adresei de email folosite la comandă.
          </p>

          <Link
            href="/"
            className="mt-9 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:opacity-90"
          >
            Înapoi la magazin
          </Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-10">
          <h1 className="text-4xl font-bold">Coșul este gol</h1>

          <p className="mt-4 text-neutral-400">
            Adaugă produse înainte de finalizarea comenzii.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:opacity-90"
          >
            Vezi produsele
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
        VIRELLO
      </p>

      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
        Finalizare comandă
      </h1>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={submitOrder}
          className="space-y-8 rounded-3xl border border-white/10 bg-neutral-900 p-7"
        >
          <div>
            <h2 className="text-2xl font-bold">Date personale</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Nume</span>

                <input
                  required
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={updateForm}
                  autoComplete="family-name"
                  placeholder="Popescu"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Prenume</span>

                <input
                  required
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={updateForm}
                  autoComplete="given-name"
                  placeholder="Andrei"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Email</span>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateForm}
                  autoComplete="email"
                  placeholder="andrei@email.ro"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Telefon</span>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateForm}
                  autoComplete="tel"
                  placeholder="07xx xxx xxx"
                  minLength={8}
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Adresa de livrare</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Județ</span>

                <input
                  required
                  type="text"
                  name="county"
                  value={form.county}
                  onChange={updateForm}
                  autoComplete="address-level1"
                  placeholder="Cluj"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-neutral-300">Localitate</span>

                <input
                  required
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={updateForm}
                  autoComplete="address-level2"
                  placeholder="Cluj-Napoca"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm text-neutral-300">
                  Stradă și număr
                </span>

                <input
                  required
                  type="text"
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={updateForm}
                  autoComplete="street-address"
                  placeholder="Strada Exemplu, nr. 10"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm text-neutral-300">
                  Bloc, scară, etaj, apartament
                </span>

                <input
                  type="text"
                  name="addressDetails"
                  value={form.addressDetails}
                  onChange={updateForm}
                  placeholder="Opțional"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-4 text-white caret-[#D4AF37] outline-none transition placeholder:text-neutral-500 focus:border-[#D4AF37]"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Metoda de plată</h2>

            <label className="mt-6 flex cursor-pointer items-center gap-4 rounded-xl border border-[#D4AF37]/40 bg-black p-5">
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                defaultChecked
                className="h-5 w-5 accent-[#D4AF37]"
              />

              <span>
                <strong>Plată ramburs</strong>

                <span className="mt-1 block text-sm text-neutral-400">
                  Plătești curierului la livrare.
                </span>
              </span>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-neutral-300">
              Observații pentru comandă
            </span>

            <textarea
              name="notes"
              value={form.notes}
              onChange={updateForm}
              placeholder="Informații suplimentare pentru livrare"
              rows={4}
              maxLength={1000}
              className="w-full resize-y rounded-xl border border-white/15 bg-black px-4 py-4 outline-none transition focus:border-[#D4AF37]"
            />
          </label>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Se trimite comanda..."
              : `Trimite comanda – ${formatPrice(total)}`}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Comanda va fi trimisă pentru confirmare.
          </p>
        </form>

        <aside className="h-fit rounded-3xl border border-white/10 bg-neutral-900 p-7 lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold">Comanda ta</h2>

          <div className="mt-6 space-y-5">
            {cart.map((product) => (
              <div key={product.id} className="border-b border-white/10 pb-5">
                <p className="font-semibold">{product.name}</p>

                <div className="mt-2 flex justify-between gap-4 text-sm text-neutral-400">
                  <span>Cantitate: {product.quantity}</span>

                  <span>
                    {formatPrice(
                      priceToNumber(product.price) * product.quantity,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-neutral-300">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Livrare</span>

              <span
                className={delivery === 0 ? "font-bold text-green-400" : ""}
              >
                {delivery === 0 ? "Gratuită" : formatPrice(delivery)}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              VIRELLO Rewards
            </p>

            <p className="mt-2 text-2xl font-bold">⭐ {loyaltyPoints} puncte</p>

            <p className="mt-2 text-sm leading-6 text-neutral-300">
              Primești 1 punct pentru fiecare 10 lei din valoarea produselor
              comandate.
            </p>
          </div>

          {hasSurpriseGift && (
            <p className="mt-4 rounded-xl border border-purple-400/30 bg-purple-400/10 p-4 text-sm text-purple-200">
              🎁 Cadou surpriză VIRELLO inclus.
            </p>
          )}

          <div className="my-6 border-t border-white/10" />

          <div className="flex justify-between gap-4 text-xl font-bold">
            <span>Total</span>

            <span className="text-[#D4AF37]">{formatPrice(total)}</span>
          </div>

          <Link
            href="/Cos"
            className="mt-6 block text-center text-sm text-neutral-400 transition hover:text-white"
          >
            ← Înapoi la coș
          </Link>
        </aside>
      </div>
    </section>
  );
}