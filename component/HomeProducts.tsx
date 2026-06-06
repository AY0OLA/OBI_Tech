import { ProductParams } from "@/shared.types";
import ProductCard from "./ProductCard";

interface HomeProductsParams {
  products: ProductParams[];
}
const HomeProducts = ({ products }: HomeProductsParams) => {
  return (
    <div className="flex flex-col items-center p-14">
      <p className="text-2xl font-medium text-center w-full">
        Popular products
      </p>

      <div className=" grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pb-14 w-full max-w-[1500px]">
        {products.map((product, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      {/* <button className="px-12 py-2.5 mb-4 border rounded bg-[#043033] text-white hover:bg-black transition">
        See more
      </button> */}
    </div>
  );
};

export default HomeProducts;
