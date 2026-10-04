"use server";

export const getProducts = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/products`, {
      cache: "force-cache",
      next: { tags: ["products"] }, 
    });

    if (!res.ok) {
      console.log("Failed to fetch products");
      return null;
    }

    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};


export const getProductById = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/products/${encodeURIComponent(id)}`,
      {
        cache: "force-cache",
        next: { tags: ["products", `product-${id}`] },
      },
    );

    if (!res.ok) {
      // 400/404 = invalid or missing product, 5xx = server problem
      return null;
    }

    const product = await res.json();

    // Extra safety: treat an empty or malformed body as "nothing found"
    if (!product || !product.id) {
      return null;
    }

    return product;
  } catch (err) {
    console.log(err);
    return null;
  }
};