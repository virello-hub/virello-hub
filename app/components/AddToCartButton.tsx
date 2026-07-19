"use client";

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: string;
};

type CartProduct = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

export default function AddToCartButton({
  id,
  name,
  price,
}: AddToCartButtonProps) {
  function addToCart() {
    const savedCart = window.localStorage.getItem("virello-cart");

    const cart: CartProduct[] = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingProduct = cart.find(
      (product) => product.id === id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        quantity: 1,
      });
    }

    window.localStorage.setItem(
      "virello-cart",
      JSON.stringify(cart)
    );

    window.location.assign("/Cos");
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      className="mt-8 w-full rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black transition hover:opacity-90 sm:w-fit"
    >
      Adaugă în coș
    </button>
  );
}