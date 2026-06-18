import { ProductParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductParams }) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image_url_array[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Product Name */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-medium text-gray-700">4.5</span>
          <span className="text-xs text-gray-400">(120 reviews)</span>
        </div>

        {/* Price + Button */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {process.env.currency}
              {product.price}
            </p>
          </div>

          <button
            className="
            rounded-lg
            bg-black
            px-3 py-2
            text-xs sm:text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            active:scale-95
          "
          >
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
