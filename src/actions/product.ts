"use server";

// my data will never change, so i implemented that it would fetch once 
export const getProducts = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/v1/products", {
      cache: "force-cache",
      next: { tags: ["products"] }, // optional, lets you refresh it manually later
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
      `http://localhost:8080/api/v1/products/${encodeURIComponent(id)}`,
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