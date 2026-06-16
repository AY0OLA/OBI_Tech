"use client";

import { ProductParams } from "@/shared.types";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { assets } from "@/public/assests/assets";
import Link from "next/link";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";

const ProductDetails = ({ product }: { product: ProductParams }) => {
  const handleAddToCart = () => {
    const addItem = cartStore.getState().addItem;
    addItem(product);
    toast.success("Check Cart");
  };

  
return (
  <>
    <Navbar />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src={product.image_url_array[0]}
              alt={product.name}
              width={1000}
              height={1000}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_icon}
                alt="star"
              />
              <Image
                className="h-4 w-4"
                src={assets.star_dull_icon}
                alt="star"
              />
            </div>

            <p className="text-sm text-slate-500">(4.5 Reviews)</p>
          </div>

          {/* Description */}
          <p className="mt-5 leading-7 text-slate-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-6 flex items-center gap-3">
            <p className="text-4xl font-bold text-[#043033]">
              {process.env.NEXT_PUBLIC_CURRENCY}
              {product.price}
            </p>

            {product.offer_price && (
              <span className="text-lg text-slate-400 line-through">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {product.offer_price}
              </span>
            )}
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Product Info */}
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-2 font-medium text-slate-700">Brand</td>
                <td className="py-2 text-slate-500">{product.brand}</td>
              </tr>

              {product.colors && (
                <tr>
                  <td className="py-2 font-medium text-slate-700">Colors</td>
                  <td className="py-2 text-slate-500">
                    {product.colors.join(", ")}
                  </td>
                </tr>
              )}

              <tr>
                <td className="py-2 font-medium text-slate-700">Category</td>
                <td className="py-2 text-slate-500">
                  {product.category.name}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Product Comment */}
          {product.product_comment && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-slate-600">
                {product.product_comment}
              </p>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-medium text-slate-800">
                Available Sizes
              </h3>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className="
                      border
                      border-slate-300
                      px-4
                      py-2
                      rounded-lg
                      text-sm
                      hover:border-[#043033]
                      hover:text-[#043033]
                      transition
                    "
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="
                flex-1
                rounded-xl
                border
                border-[#043033]
                py-4
                font-medium
                text-[#043033]
                hover:bg-[#043033]
                hover:text-white
                transition
              "
            >
              Add to Cart
            </button>

            <Link
              href={`/buy-now/${product.id}`}
              className="
                flex-1
                rounded-xl
                bg-[#043033]
                py-4
                text-center
                font-medium
                text-white
                hover:bg-black
                transition
              "
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      {product.image_url_array.length > 1 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Product Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.image_url_array.map((image, index) => (
              <div
                key={index}
                className="
                  aspect-square
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-100
                "
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={500}
                  height={500}
                  className="
                    h-full
                    w-full
                    object-cover
                    hover:scale-105
                    transition
                    duration-300
                  "
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </>
);

};

export default ProductDetails;
