"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, ShoppingBag, Package } from "lucide-react";

const UserOrders = ({ userOrders }: { userOrders: OrderParams[] }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
                My Orders
              </h1>

              <p className="mt-3 text-slate-500 text-base md:text-lg">
                Track, manage and review all your purchases in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-slate-700
                  shadow-sm
                  transition-all
                  hover:border-[#043033]
                  hover:text-[#043033]
                "
              >
                <ArrowLeft size={18} />
                Back Home
              </Link>

              <Link
                href="/all-products"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#043033]
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  hover:bg-black
                "
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Orders */}
        {userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  hover:shadow-lg
                "
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Product */}
                    <div className="flex gap-5 flex-1">
                      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <Image
                          src={order.image_url}
                          alt={order.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {order.product_name}
                        </h3>

                        <p className="mt-2 text-slate-500">
                          Quantity: {order.quantity_bought}
                        </p>

                        {order.size && (
                          <p className="text-slate-500">Size: {order.size}</p>
                        )}

                        <p className="mt-3 text-2xl font-bold text-[#043033]">
                          {process.env.NEXT_PUBLIC_CURRENCY}
                          {Number(order.amount_paid).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex-1">
                      <h4 className="mb-3 font-semibold text-slate-900">
                        Delivery Address
                      </h4>

                      <p className="leading-7 text-slate-600">
                        {order.region}
                        <br />
                        {order.address}
                        <br />
                        {order.state}, {order.city}
                        <br />
                        {order.country_code}
                        {order.phone}
                      </p>
                    </div>
                  </div>

                  <hr className="my-6 border-slate-200" />

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Order Date: {order.created_at || "N/A"}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-slate-500">Status:</span>

                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            border
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            capitalize
                            ${getStatusStyles(order.status)}
                          `}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {(order.status === "completed" ||
                        order.status === "cancelled") && (
                        <button
                          className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-2
                            text-red-600
                            transition
                            hover:bg-red-100
                          "
                        >
                          Delete
                        </button>
                      )}

                      {order.status === "completed" &&
                        order.status !== "reviewed" && (
                          <Link
                            href={`/add-review/${order.id}`}
                            className="
                              rounded-xl
                              bg-black
                              px-4
                              py-2
                              text-white
                              transition
                              hover:bg-[#043033]
                            "
                          >
                            Review Product
                          </Link>
                        )}

                      <Link
                        href={`/order/${order.id}`}
                        className="
                          rounded-xl
                          bg-[#043033]
                          px-4
                          py-2
                          text-white
                          transition
                          hover:bg-black
                        "
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="mt-10 rounded-3xl bg-[#043033] p-10 text-center text-white">
              <Home className="mx-auto mb-4 h-10 w-10" />

              <h3 className="text-3xl font-bold">
                Thank You for Shopping with OBI-Tech
              </h3>

              <p className="mt-3 max-w-2xl mx-auto text-slate-300">
                We appreciate your trust in us. Continue exploring our
                collection of premium products and discover something new.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/all-products"
                  className="
                    rounded-xl
                    bg-white
                    px-6
                    py-3
                    font-semibold
                    text-[#043033]
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="
                    rounded-xl
                    border
                    border-white/30
                    px-6
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-12 w-12 text-slate-500" />
            </div>

            <h3 className="mt-6 text-3xl font-bold text-slate-900">
              No Orders Yet
            </h3>

            <p className="mt-3 max-w-md mx-auto text-slate-500">
              You haven't placed any orders yet. Start shopping and your
              purchases will appear here.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/all-products"
                className="
                  rounded-xl
                  bg-[#043033]
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-black
                "
              >
                Shop Now
              </Link>

              <Link
                href="/"
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-6
                  py-3
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >
                Back Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
