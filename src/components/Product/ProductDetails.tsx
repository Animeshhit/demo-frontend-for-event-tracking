"use client";
import { useState } from "react";
import { Product } from "@/types/types";
import { money } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Rating from "../Home/Rating";
import { Button } from "../ui/button";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { EVENTS } from "@/lib/analytics/events";

export default function ProductDetail({ product }: { product: Product }) {
  useEffect(() => {
    trackEvent({ eventName: EVENTS.PRODUCT_VIEW, productId: product.id,properties:{productName:product.name} });
  }, [product.id]);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = () => {
    addToCart(product.id, quantity, product.priceMinor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
      <Link href="/" className="text-sm text-black/50 hover:text-black">
        ← Back to collection
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e9e8e1]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[.18em] text-black/45">
            {product.category}
          </p>
          <h1 className="mt-4 text-5xl font-light leading-[.95] tracking-[-.07em]">
            {product.name}
          </h1>
          <div className="mt-5 flex items-center gap-4">
            <Rating product={product} />
            <span className="text-xs text-black/45">
              {product.stock} in stock
            </span>
          </div>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-black/65">
            {product.description}
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-3xl">{money(product.priceMinor)}</span>
            <del className="text-black/35">
              {money(product.originalPriceMinor)}
            </del>
            <span className="rounded-full bg-[#c1fbd4] px-3 py-1 text-xs">
              Save{" "}
              {Math.round(
                (1 - product.priceMinor / product.originalPriceMinor) * 100,
              )}
              %
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center rounded-full border border-black/15">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="p-3"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button onClick={add} className="rounded-full px-7">
              {added ? (
                <>
                  <Check data-icon="inline-start" /> Added to bag
                </>
              ) : (
                "Add to bag"
              )}
            </Button>
            <Link
              href={`/checkout?buyNow=${product.id}`}
              onClick={() => {
                trackEvent({
                  eventName: EVENTS.BUY_NOW,
                  productId: product.id,
                  properties: {
                    quantity,
                    priceMinor: product.priceMinor,
                  },
                });
              }}
              className="inline-flex items-center rounded-full border border-black px-7 py-2 text-sm hover:bg-black hover:text-white"
            >
              Buy now
            </Link>
          </div>
          {added && (
            <p className="mt-4 text-sm text-emerald-700">
              Added successfully. Your bag is ready when you are.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
