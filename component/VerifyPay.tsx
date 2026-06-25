"use client";

import { createOrder } from "@/utils/action/order.actions";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const VerifyPay = ({
  reference,
  amount,
  email,
}: {
  reference: string;
  amount: number;
  email: string;
}) => {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const paymentInfo = JSON.parse(
      localStorage.getItem("paymentInformation") || "{}",
    );

    const isValidPayment =
      paymentInfo.amount === amount / 100 && paymentInfo.userEmail === email;

    if (!isValidPayment) {
      toast.error("Payment Verification Error");
      return;
    }

    const makeOrder = async () => {
      const localStorageItems = JSON.parse(
        localStorage.getItem("paymentInformation") || "{}",
      );

      const orderItems = {
        amount: localStorageItems.amount,
        user_email: localStorageItems.userEmail,
        productName: localStorageItems.productName,
        quantity: localStorageItems.quantity,
        productCategory: localStorageItems.productCategory,
        productImage: localStorageItems.image,
        address: localStorageItems.fullAddressFields,
        paymentReference: reference,
      };

      try {
        const orderId = await createOrder(orderItems);

        localStorage.removeItem("paymentInformation");

        router.replace(`/order/${orderId}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create order");
      }
    };

    makeOrder();
  }, [amount, email, reference, router]);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#043033]/10">
              <svg
                className="h-8 w-8 text-[#043033]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2A9 9 0 1112 3a9 9 0 019 9z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Verifying Payment
            </h1>

            <p className="mt-2 text-slate-500">
              Please wait while we confirm your transaction details.
            </p>
          </div>

          {/* Payment Details */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-slate-500">Reference</span>
              <span className="font-medium text-slate-900 break-all text-right">
                {reference}
              </span>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold text-[#043033]">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {(amount / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-slate-500">Customer Email</span>
              <span className="font-medium text-slate-900 break-all text-right">
                {email}
              </span>
            </div>
          </div>

          {/* Loader */}
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#043033]" />
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Do not close this page while verification is in progress.
          </p>
        </div>
      </div>
    </div>
  );
};
