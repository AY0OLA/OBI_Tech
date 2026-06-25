"use client";
import { createOrder } from "@/utils/action/order.actions";
import Link from "next/link";

import { useEffect } from "react";
import toast from "react-hot-toast";

export const VerifyPayCart = ({
  reference,
  amount,
  email,
}: {
  reference: string;
  amount: number;
  email: string;
}) => {
  useEffect(() => {
    const paymentInfo = JSON.parse(
      localStorage.getItem("paymentInformation") || "{}",
    );
    if (paymentInfo.amount !== amount || paymentInfo.userEmail !== email) {
      toast.error("Payment Verification Error");
      return;
    } else {
      toast.success("Payment Verified Successfully");

      const makeOrder = async () => {
        for (const eachItem of paymentInfo.items) {
          const orderItem = {
            user_id: paymentInfo.userId,
            amount: paymentInfo.amount,
            user_email: paymentInfo.userEmail,
            productName: eachItem.name,
            quantity: eachItem.quantity,
            productCategory: eachItem.category.name,
            productImage: eachItem.image_url_array[0],
            address: paymentInfo.fullAddressFields,
            paymentReference: reference,
          };

          await createOrder(orderItem);
        }
      };

      makeOrder();
    }
  });
return (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#043033] px-8 py-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border border-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-3xl md:text-4xl font-bold text-white">
          Payment Verification
        </h1>

        <p className="mt-3 text-slate-300">
          Your payment is being verified and your order is being processed.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Transaction Details
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-200 pb-3">
              <span className="text-slate-500">Payment Reference</span>
              <span className="font-medium text-slate-900 break-all">
                {reference}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-200 pb-3">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-semibold text-[#043033]">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {(amount / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-slate-500">Customer Email</span>
              <span className="font-medium text-slate-900 break-all">
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-700">
            ✓ Payment verification completed successfully.
          </p>

          <p className="mt-1 text-sm text-green-600">
            Your order has been received and will appear in your orders page.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="
              flex-1
              rounded-xl
              bg-[#043033]
              px-6
              py-3
              text-center
              font-semibold
              text-white
              transition
              hover:bg-black
            "
          >
            View My Orders
          </Link>

          <Link
            href="/all-products"
            className="
              flex-1
              rounded-xl
              border
              border-slate-300
              px-6
              py-3
              text-center
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  </div>
);
};
