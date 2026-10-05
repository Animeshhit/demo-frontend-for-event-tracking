"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { Product } from "@/types/types";
import { getProducts } from "@/actions/product";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { EVENTS } from "@/lib/analytics/events";

export default function HomeContent() {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(
    null,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products) {
      const filtered =
        category === "All"
          ? products
          : products.filter((p) => p.category === category);
      setFilteredProducts(filtered);
    }
  }, [category, products]);

  return (
    <>
      <section className="bg-black px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="mb-8 text-xs uppercase tracking-[.2em] text-white/55">
              Everything you need, in one place
            </p>
            <h1 className="max-w-3xl text-5xl font-light leading-[.95] tracking-[-.07em] sm:text-7xl lg:text-[7rem]">
              Shop smarter.
              <br />
              <em className="font-serif not-italic text-[#c1fbd4]">
                Live better.
              </em>
            </h1>
          </div>
          <div className="max-w-sm pb-2 lg:justify-self-end">
            <p className="text-lg leading-relaxed text-white/70">
              Electronics, sportswear, apparel, accessories and home essentials,
              hand-picked for quality and delivered fast.
            </p>
            <Link
              href="#shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm hover:bg-white hover:text-black"
            >
              Shop now <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <main id="shop" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-black/45">
              Shop / 01
            </p>
            <h2 className="mt-2 text-3xl font-light tracking-[-.05em]">
              Featured products
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Electronics",
              "Sports",
              "Apparel",
              "Accessories",
              "Home",
            ].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item);
                  if (item !== "All") {
                    trackEvent({
                      eventName: EVENTS.CATEGORY_CLICK,
                      properties: {
                        categoryName: item,
                      },
                    });
                  }
                }}
                className={`rounded-full border px-4 py-2 text-xs transition ${
                  category === item
                    ? "border-black bg-black text-white"
                    : "border-black/15 hover:border-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <section
        id="story"
        className="mx-5 mb-16 rounded-2xl bg-[#d4f9e0] px-6 py-14 lg:mx-8 lg:px-14"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-end">
          <p className="text-4xl font-light leading-tight tracking-[-.06em] lg:text-6xl">
            Quality you can trust.
            <br />
            Delivered to your door.
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-black/65">
            At e-commerce, every product is chosen for its quality, value and
            design. Enjoy fast shipping, easy 30-day returns and support that
            actually helps.
          </p>
        </div>
      </section>
    </>
  );
}
