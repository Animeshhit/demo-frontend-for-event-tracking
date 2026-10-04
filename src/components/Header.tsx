"use client";
import { useCartStore } from "@/store/use-cart";
import { useSearch } from "@/hooks/use-search";
import {  useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export default function Header() {
  const user = useUserStore((s) => s.user);
  const cartItemCount = useCartStore((state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0),
  );
  const { query, setQuery, results, clearSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const shown = query ? results : [];
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfbf5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
        <Link
          href="/"
          className="mr-auto text-xl font-semibold tracking-[-0.06em]"
        >
          E-commerce
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="hover:opacity-60">
            Shop
          </Link>
          <a href="#story" className="hover:opacity-60">
            Our standard
          </a>
          <a href="#journal" className="hover:opacity-60">
            Journal
          </a>
        </nav>
        <div className="relative hidden w-52 lg:block">
          <Search className="absolute left-3 top-2.5 size-4 text-black/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search objects"
            aria-label="Search products"
            className="h-9 w-full rounded-full border border-black/15 bg-white pl-9 pr-3 text-sm outline-none focus:border-black"
          />
          {shown.length > 0 && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
              {shown.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-black/5"
                >
                  <Image
                    src={product.image}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-md object-cover"
                  />
                  <span className="text-sm">{product.name}</span>
                </Link>
              ))}
            </div>
          )}
          {query && shown.length === 0 && (
            <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-black/10 bg-white p-4 text-sm text-black/55 shadow-xl">
              No objects found.
            </div>
          )}
        </div>
        {/* will implement logout later */}
        {user ? (
         <p>{user.name.split(" ")[0]}</p>
        ) : (
          <Link
            href="/auth/login"
            className="relative flex items-center gap-3 p-2"
            aria-label="sign in"
          >
            <UserRound className="size-4" />
            Sign in
          </Link>
        )}
        <Link
          href="/cart"
          className="relative rounded-full border border-black/15 p-2"
          aria-label="Cart"
        >
          <ShoppingBag />
          <span className="absolute -right-1 -top-2 min-w-4 rounded-full bg-black px-1 text-center text-[10px] text-white">
            {cartItemCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
