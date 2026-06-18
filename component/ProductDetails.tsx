"use client";
import { useState } from "react";
import { ProductParams } from "@/shared.types";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { assets } from "@/public/assests/assets";
import Link from "next/link";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";

const ProductDetails = ({ product }: { product: ProductParams }) => {
  const [selectedImage, setSelectedImage] = useState(
    product.image_url_array[0],
  );
  const handleAddToCart = () => {
    const addItem = cartStore.getState().addItem;
    addItem(product);
    toast.success("Check Cart");
  };

  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
              <Image
                src={selectedImage}
                alt={product.name}
                width={1200}
                height={1200}
                priority
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            {product.image_url_array.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.image_url_array.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image
                        ? "border-[#043033]"
                        : "border-slate-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:sticky lg:top-24 h-fit rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            {/* Product Name */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center rounded-full bg-amber-50 px-3 py-1">
                <span className="text-amber-500 mr-1">★</span>
                <span className="font-medium">4.5</span>
              </div>

              <span className="text-sm text-slate-500">
                120 verified reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <p className="text-4xl md:text-5xl font-bold text-[#043033]">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {product.price}
              </p>

              {product.offer_price && (
                <>
                  <p className="text-xl text-slate-400 line-through">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.offer_price}
                  </p>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                    Sale
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="mb-3 font-semibold text-slate-900">Description</h3>

              <p className="leading-8 text-slate-600">{product.description}</p>
            </div>

            {/* Product Information */}
            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-medium text-slate-800">
                    {product.brand}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium text-slate-800">
                    {product.category.name}
                  </span>
                </div>

                {product.colors && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Colors</span>
                    <span className="font-medium text-slate-800">
                      {product.colors.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Comment */}
            {product.product_comment && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="leading-7 text-slate-600">
                  {product.product_comment}
                </p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-semibold text-slate-900">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="
                      min-w-[60px]
                      rounded-xl
                      border
                      border-slate-300
                      px-5
                      py-3
                      text-sm
                      font-medium
                      transition
                      hover:border-[#043033]
                      hover:bg-[#043033]
                      hover:text-white
                    "
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="
                flex-1
                rounded-xl
                border-2
                border-[#043033]
                py-4
                font-semibold
                text-[#043033]
                transition
                hover:bg-[#043033]
                hover:text-white
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
                font-semibold
                text-white
                transition
                hover:bg-black
              "
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {product.image_url_array.length > 1 && (
          <section className="mt-20">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">
              More Images
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {product.image_url_array.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
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
