import {Product} from "@/types/types";
import {Star} from "lucide-react";

export default function Rating({ product }: { product: Product }) {
  return (
    <span className="flex items-center gap-1 text-xs text-black/60">
      <Star className="size-3 fill-black" /> {product.rating} (
      {product.ratingCount})
    </span>
  );
}