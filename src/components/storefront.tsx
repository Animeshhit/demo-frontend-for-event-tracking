// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useMemo, useState } from "react";
// import {
//   Search,
//   ShoppingBag,
//   UserRound,
//   Star,
//   ArrowRight,
//   Plus,
//   Minus,
//   Trash2,
//   Check,
//   X,
//   Sparkles,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { products, getProductById } from "@/lib/products";
// import { useCart } from "@/hooks/use-cart";
// import { useAuth } from "@/hooks/use-auth";
// import { useSearch } from "@/hooks/use-search";
// import { trackEvent } from "@/lib/tracking";
// import type { Product } from "@/types/types";
// import Header from "./Header";


















// export function SearchEmpty() {
//   return (
//     <div className="flex flex-col items-center py-24 text-center">
//       <Search className="size-8 stroke-1" />
//       <p className="mt-4 text-lg">No objects matched your search.</p>
//       <Link href="/" className="mt-5 text-sm underline">
//         Clear search
//       </Link>
//     </div>
//   );
// }


// export function getProductList(query?: string) {
//   return useMemo(
//     () =>
//       query
//         ? products.filter((p) =>
//             p.name.toLowerCase().includes(query.toLowerCase()),
//           )
//         : products,
//     [query],
//   );
// }
