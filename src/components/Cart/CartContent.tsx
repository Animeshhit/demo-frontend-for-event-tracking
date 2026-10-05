"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/types/types";
import { money } from "@/lib/utils";
import { getProductById } from "@/actions/product";

import { trackEvent } from "@/lib/analytics/trackEvent";
import { EVENTS } from "@/lib/analytics/events";

export default function CartContent() {
  const { cart, isLoading, updateQuantity, removeFromCart, getCartTotal } =
    useCart();

  const handleRemoveFromCart = (productId: string, quantity: number) => {
    removeFromCart(productId);

    trackEvent({
      eventName: EVENTS.REMOVE_FROM_CART,
      productId,
      properties: {
        quantity,
      },
    });
  };

  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const ids = cart.items.map((item) => item.productId);
    const missing = [...new Set(ids)].filter((id) => !productMap[id]);

    if (missing.length === 0) {
      setLoadingProducts(false);
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      const results = await Promise.all(
        missing.map((id) => getProductById(id)),
      );
      if (cancelled) return;

      setProductMap((prev) => {
        const next = { ...prev };
        results.forEach((product) => {
          if (product) next[product.id] = product;
        });
        return next;
      });
      setLoadingProducts(false);
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [cart.items, isLoading]);

  const items = cart.items
    .map((item) => ({ ...item, product: productMap[item.productId] }))
    .filter((item): item is typeof item & { product: Product } =>
      Boolean(item.product),
    );

  if (isLoading || loadingProducts)
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-black/50">
        Loading your bag…
      </div>
    );
  if (!items.length)
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center px-5 py-32 text-center">
        <ShoppingBag className="size-10 stroke-1" />
        <h1 className="mt-5 text-4xl font-light tracking-[-.06em]">
          Your bag is empty
        </h1>
        <p className="mt-3 text-black/55">Good things take a little looking.</p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-black px-6 py-3 text-sm text-white"
        >
          Continue shopping
        </Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="text-xs uppercase tracking-[.18em] text-black/45">
        Your bag
      </p>
      <h1 className="mt-3 text-5xl font-light tracking-[-.07em]">
        {items.length} considered {items.length === 1 ? "object" : "objects"}.
      </h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-black/10">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 py-5 first:pt-0">
              <Image
                src={product.image}
                alt={product.name}
                width={120}
                height={140}
                className="size-28 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-black/50">
                      {money(product.priceMinor)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(product.id, quantity)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 className="size-4 text-black/45 hover:text-red-600" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-black/15">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-2"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-7 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="text-sm">
                    {money(product.priceMinor * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-black/10">
          <h2 className="font-medium">Summary</h2>
          <div className="mt-6 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{money(getCartTotal())}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm text-black/55">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div className="my-6 border-t border-black/10" />
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span>{money(getCartTotal())}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-black px-5 py-3 text-center text-sm text-white hover:bg-black/75"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/"
            className="mt-4 block text-center text-sm text-black/55 hover:text-black"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
