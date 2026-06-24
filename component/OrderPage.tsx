import { OrderParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const OrderPage = ({ orderData }: { orderData: OrderParams }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-700 border-green-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-slate-700
              shadow-sm
              transition-all
              hover:border-[#043033]
              hover:text-[#043033]
              hover:shadow-md
            "
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
            Order Details
          </h1>

          <p className="mt-3 text-slate-500 text-base md:text-lg">
            View your purchased product, delivery information and order status.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Product Image */}
            <div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <Image
                  src={orderData.image_url}
                  alt={orderData.product_name}
                  width={1200}
                  height={1200}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-105
                  "
                />
              </div>
            </div>

            {/* Product & Order Info */}
            <div className="flex flex-col">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-400">
                  Product
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {orderData.product_name}
                </h2>

                <p className="mt-5 text-4xl font-bold text-[#043033]">
                  {`${process.env.NEXT_PUBLIC_CURRENCY}`}
                  {Number(orderData.amount_paid).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <hr className="my-8 border-slate-200" />

              {/* Delivery Information */}
              <div>
                <h3 className="mb-5 text-xl font-semibold text-slate-900">
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-500">Region</span>
                    <span className="font-medium text-slate-800">
                      {orderData.region}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-500">State</span>
                    <span className="font-medium text-slate-800">
                      {orderData.state}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-500">City</span>
                    <span className="font-medium text-slate-800">
                      {orderData.city}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium text-slate-800">
                      {orderData.country_code}
                      {orderData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-10">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  Order Status
                </h3>

                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    capitalize
                    ${
                      statusStyles[
                        orderData.status as keyof typeof statusStyles
                      ] || "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  `}
                >
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-3xl bg-[#043033] p-8 text-center text-white">
          <ShoppingBag className="mx-auto mb-4 h-10 w-10" />

          <h3 className="text-2xl font-bold">
            Thank you for shopping with OBI-Tech
          </h3>

          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
            Discover more premium products and continue exploring our latest
            collections.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/all-products"
              className="
                rounded-xl
                bg-white
                px-6
                py-3
                text-sm
                font-semibold
                text-[#043033]
                transition
                hover:scale-[1.02]
              "
            >
              Browse Products
            </Link>

            <Link
              href="/"
              className="
                rounded-xl
                border
                border-white/30
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-white/10
              "
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
