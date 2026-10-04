"use client";
import { useCart } from "@/store/use-cart";
import { useEffect, useState } from "react";
// import { trackEvent } from "@/lib/tracking";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { money } from "@/lib/utils";
import Link from "next/link";
import { Product } from "@/types/types";
import { getProductById } from "@/actions/product";

export function CheckoutContent({ buyNowId }: { buyNowId?: string }) {
  const { cart, isLoading, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [step, setStep] = useState<
    "address" | "summary" | "processing" | "result"
  >("address");
  const [result, setResult] = useState<"success" | "failure" | null>(null);

  // products we've fetched so far, keyed by id
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  const buyNow = Boolean(buyNowId);

  useEffect(() => {
    if (isLoading) return;

    // buy now only needs one product, otherwise load everything in the bag
    const ids = buyNowId ? [buyNowId] : cart.items.map((i) => i.productId);
    const missing = [...new Set(ids)].filter((id) => !productMap[id]);

    if (missing.length === 0) {
      setLoadingProducts(false);
      return;
    }

    let cancelled = false;

    async function load() {
      const results = await Promise.all(missing.map((id) => getProductById(id)));
      if (cancelled) return;

      setProductMap((prev) => {
        const next = { ...prev };
        results.forEach((p) => {
          if (p) next[p.id] = p;
        });
        return next;
      });
      setLoadingProducts(false);
    }

    load();

    return () => {
      cancelled = true;
    };
    // productMap is left out on purpose, otherwise this would loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNowId, cart.items, isLoading]);

  const items = buyNowId
    ? productMap[buyNowId]
      ? [{ product: productMap[buyNowId], quantity: 1 }]
      : []
    : cart.items
        .map((item) => ({
          product: productMap[item.productId],
          quantity: item.quantity,
        }))
        .filter((x): x is { product: Product; quantity: number } =>
          Boolean(x.product),
        );

  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.priceMinor * quantity,
    0,
  );

  const valid = Object.values(form).every(Boolean);

  const pay = () => {
    setStep("processing");
    // trackEvent("CHECKOUT_STARTED");
    setTimeout(() => setStep("result"), 900);
  };

  const complete = (kind: "success" | "failure") => {
    setResult(kind);
    // trackEvent(kind === "success" ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED");
    if (kind === "success" && !buyNow) clearCart();
  };

  // without this, "Nothing to checkout" flashes while products are loading
  if ((isLoading || loadingProducts) && step !== "result")
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-black/50">
        Getting your order ready…
      </div>
    );

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[.18em] text-black/45">
          Checkout / {buyNow ? "Buy now" : "Your bag"}
        </p>
        <h1 className="mt-3 text-5xl font-light tracking-[-.07em]">
          Complete your order.
        </h1>
      </div>
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <section>
          {step === "address" && (
            <div>
              <h2 className="text-xl">01 / Delivery address</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Full name"],
                  ["phone", "Phone number"],
                  ["address", "Address line"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "Pincode"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className={key === "address" ? "sm:col-span-2" : ""}
                  >
                    <span className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                      {label}
                    </span>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="h-12 w-full rounded-lg border border-black/15 bg-transparent px-3 outline-none focus:border-black"
                    />
                  </label>
                ))}
              </div>
              <button
                disabled={!valid}
                onClick={() => setStep("summary")}
                className="mt-8 rounded-full bg-black px-6 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Continue to summary{" "}
                <ArrowRight className="ml-2 inline size-4" />
              </button>
            </div>
          )}
          {step === "summary" && (
            <div>
              <h2 className="text-xl">02 / Review and pay</h2>
              <div className="mt-6 rounded-xl border border-black/10 p-5">
                <p className="text-sm font-medium">Delivering to {form.name}</p>
                <p className="mt-1 text-sm text-black/55">
                  {form.address}, {form.city}, {form.state} {form.pincode}
                </p>
                <button
                  onClick={() => setStep("address")}
                  className="mt-4 text-xs underline"
                >
                  Edit address
                </button>
              </div>
              <button
                onClick={pay}
                className="mt-8 rounded-full bg-black px-7 py-3 text-sm text-white"
              >
                Buy now <ArrowRight className="ml-2 inline size-4" />
              </button>
            </div>
          )}
          {step === "processing" && (
            <div className="rounded-2xl bg-black p-10 text-center text-white">
              <Sparkles className="mx-auto animate-pulse" />
              <h2 className="mt-5 text-2xl font-light">
                Preparing your demo payment…
              </h2>
            </div>
          )}
          {step === "result" && (
            <div className="rounded-2xl border border-black/10 p-8">
              <p className="text-xs uppercase tracking-widest text-black/45">
                Demo payment simulation
              </p>
              <h2 className="mt-3 text-3xl font-light">Choose the outcome.</h2>
              <p className="mt-3 text-sm text-black/55">
                Nothing is charged. Select a result to continue the demo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => complete("success")}
                  className="rounded-full bg-[#baf4cd] px-5 py-3 text-sm"
                >
                  Simulate success
                </button>
                <button
                  onClick={() => complete("failure")}
                  className="rounded-full border border-red-200 px-5 py-3 text-sm text-red-700"
                >
                  Simulate failure
                </button>
              </div>
            </div>
          )}
          {result === "failure" && (
            <div className="mt-5 flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <span>Payment failed. Your bag is unchanged.</span>
              <button
                onClick={() => {
                  setResult(null);
                  setStep("result");
                }}
                className="underline"
              >
                Retry
              </button>
            </div>
          )}
        </section>
        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-black/10">
          <h2 className="font-medium">Order summary</h2>
          <div className="mt-5 flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex justify-between gap-4 text-sm"
              >
                <span>
                  {product.name} × {quantity}
                </span>
                <span>{money(product.priceMinor * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="my-6 border-t border-black/10" />
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
