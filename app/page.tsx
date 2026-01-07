import { getNewProducts } from "@/app/services/product.service";
import ProductCard from "@/app/components/product/ProductCard";

export default async function HomePage() {
  const products = await getNewProducts();

  if (!products.length) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">No products available</p>
      </section>
    );
  }

  return (
    <section className=" text-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Men&apos;s Jordan Shoes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product, index) => {
            const colors: ("green" | "vilot" | "red" | "pink")[] = ["green", "red", "vilot", "pink"];
            const defaultColor = colors[index];

            return (
              <ProductCard
                key={product.id}
                product={product}
                defaultColor={defaultColor}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}