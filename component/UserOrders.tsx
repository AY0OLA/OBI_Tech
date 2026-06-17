"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";

const UserOrders = ({ userOrders }: { userOrders: OrderParams[] }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            My Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Track and manage all your purchases.
          </p>
        </div>

        <div className="space-y-5">
          {userOrders.map((order, index) => (
            <div
              key={index}
              className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              hover:shadow-md
              transition
              overflow-hidden
            "
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  {/* Product */}
                  <div className="flex gap-4 flex-1">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <Image
                        src={order.image_url}
                        alt={order.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {order.product_name}
                      </h3>

                      <p className="mt-1 text-slate-500">
                        Quantity: {order.quantity_bought}
                      </p>

                      {order.size && (
                        <p className="text-slate-500">Size: {order.size}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex-1">
                    <h4 className="mb-2 font-semibold text-slate-800">
                      Delivery Address
                    </h4>

                    <p className="text-slate-600 leading-7">
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

                  {/* Payment */}
                  <div className="min-w-[150px]">
                    <h4 className="mb-2 font-semibold text-slate-800">
                      Amount Paid
                    </h4>

                    <p className="text-2xl font-bold text-[#043033]">
                      {process.env.NEXT_PUBLIC_CURRENCY}
                      {order.amount_paid}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-6 border-slate-200" />

                {/* Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500">
                      Date: {order.created_at || "N/A"}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Status:</span>

                      <span
                        className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }
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
                        bg-red-50
                        border
                        border-red-200
                        px-4
                        py-2
                        text-red-600
                        hover:bg-red-100
                        transition
                      "
                      >
                        Delete
                      </button>
                    )}

                    {order.status !== "reviewed" &&
                      order.status !== "processing" &&
                      order.status === "completed" && (
                        <Link
                          href={`/add-review/${order.id}`}
                          className="
                          rounded-xl
                          bg-black
                          px-4
                          py-2
                          text-white
                          hover:bg-[#043033]
                          transition
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
                      hover:bg-black
                      transition
                    "
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {userOrders.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No Orders Yet
              </h3>

              <p className="mt-2 text-slate-500">
                When you place an order, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
