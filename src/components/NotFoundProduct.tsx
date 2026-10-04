import { X } from "lucide-react";
import Link from "next/link";

export default function NotFoundProduct() {
  return (
    <main className="mx-auto max-w-xl px-5 py-32 text-center">
      <X className="mx-auto size-8" />
      <h1 className="mt-5 text-4xl font-light">Product not found.</h1>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm text-white"
      >
        Back to shop
      </Link>
    </main>
  );
}
