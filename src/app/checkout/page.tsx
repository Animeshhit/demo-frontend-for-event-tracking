import { CheckoutContent } from "@/components/Checkout/checkout";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ buyNow?: string }>;
}) {
  const { buyNow } = await searchParams;
  return (
      <CheckoutContent buyNowId={buyNow} />
  );
}
