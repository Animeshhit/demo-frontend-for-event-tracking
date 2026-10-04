
import ProductDetail from "@/components/Product/ProductDetails";
import { getProductById } from "@/actions/product";
import NotFoundProduct from "@/components/NotFoundProduct";

export default async function ProductPage({

  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  
  if(!product) {
    return <NotFoundProduct />
  }

  return <ProductDetail product={product} />;
}
