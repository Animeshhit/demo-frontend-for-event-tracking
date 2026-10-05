import { useCart } from "@/store/use-cart";
import Link from "next/link";
import { Product } from "@/types/types";
import Image from "next/image";
import { money } from "@/lib/utils";
import { Plus } from "lucide-react";
import Rating from "./Home/Rating";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { EVENTS } from "@/lib/analytics/events";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product.id, 1, product.priceMinor);

    trackEvent({
      eventName: EVENTS.ADD_TO_CART,
      productId: product.id,
      properties: {
        quantity: 1,
        priceMinor: product.priceMinor,
      },
    });
  };

  return (
    <article className="group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#e9e8e1]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] uppercase tracking-[.12em]">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-3 pt-3">
        <div>
          <Link
            href={`/products/${product.id}`}
            className="font-medium leading-tight hover:underline"
          >
            {product.name}
          </Link>

          <Rating product={product} />

          <div className="mt-1 flex gap-2 text-sm">
            <span>{money(product.priceMinor)}</span>
            <del className="text-black/35">
              {money(product.originalPriceMinor)}
            </del>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-black text-white transition hover:bg-black/75"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </article>
  );
}