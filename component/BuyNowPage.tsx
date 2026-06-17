"use client";

import { useAppContext } from "@/context/AppContext";
import { assets } from "@/public/assests/assets";
import { AddressParams, ProductParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BuyNowPage = ({
  product,
  addresses,
}: {
  product: ProductParams;
  addresses: AddressParams[];
}) => {
  const { session } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>();
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(product.price);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams | null>(
    null,
  );
  const increaseQTY = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQTY = () => {
    if (quantity === 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const handleAddressSelect = (address: AddressParams) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const payNow = async () => {
    try {
      const result = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: totalCost * 100 + product.product_shipping_fee * 100,
          source: "buy-now",
        }),
      });

      const paystackResult = await result.json();

      if (result.status) {
        localStorage.setItem(
          "paymentInformation",
          JSON.stringify({
            userId: session?.user?.id,
            productName: product.name,
            productCategory: product.category,
            quantity: quantity,
            image: product.image_url_array[0],
            amount: totalCost + product.product_shipping_fee,
            userEmail: session?.user?.email,
            fullAddressFields: selectedAddress,
          }),
        );
        router.push(paystackResult.data.authorization_url);
      }
    } catch (error) {
      console.log("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      console.log("Payment Processed");
    }
  };

  useEffect(() => {
    localStorage.removeItem("paymentInformation");

    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.filter((eachAddress) => {
        return eachAddress.is_default === true;
      });
      setSelectedAddress(defaultAddress[0]);
    }
    setTotalCost(product.price * quantity);
  }, [quantity, product.price, userAddresses, addresses]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Product Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              The Product To Buy
            </h1>
          </div>

          {product && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative h-28 w-28 overflow-hidden rounded-xl border bg-slate-100">
                  <Image
                    src={product.image_url_array[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {product.sizes?.join(", ")}
                  </p>

                  <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                    <p className="text-2xl font-bold text-[#043033]">
                      {process.env.NEXT_PUBLIC_CURRENCY}
                      {product.price}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center border rounded-xl overflow-hidden">
                      <button
                        onClick={decreaseQTY}
                        className="px-4 py-2 hover:bg-slate-100"
                      >
                        -
                      </button>

                      <input
                        readOnly
                        value={quantity}
                        className="w-12 text-center outline-none"
                      />

                      <button
                        onClick={increaseQTY}
                        className="px-4 py-2 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sizes */}
                  {product.sizes?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          className="
                          rounded-lg
                          border
                          border-slate-300
                          px-4
                          py-2
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
                  )}
                </div>
              </div>

              <button
                className="
                mt-8
                rounded-xl
                bg-black
                px-5
                py-3
                text-white
                hover:bg-[#043033]
                transition
              "
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

            {/* Address */}
            <div className="mt-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                DELIVERY ADDRESS
              </label>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-left
                  text-sm
                "
                >
                  {selectedAddress
                    ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Select Address"}
                </button>

                {isDropdownOpen && (
                  <div
                    className="
                    absolute
                    z-20
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                    overflow-hidden
                  "
                  >
                    {userAddresses?.map((address, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddressSelect(address)}
                        className="
                        block
                        w-full
                        px-4
                        py-3
                        text-left
                        hover:bg-slate-50
                      "
                      >
                        {address.address}, {address.city}, {address.state}
                      </button>
                    ))}

                    <Link
                      href="/address"
                      className="
                      block
                      border-t
                      px-4
                      py-3
                      text-center
                      font-medium
                      text-[#043033]
                    "
                    >
                      + Add New Address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                PROMO CODE
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                "
                />

                <button
                  className="
                  rounded-xl
                  bg-black
                  px-5
                  text-white
                  hover:bg-[#043033]
                  transition
                "
                >
                  Apply
                </button>
              </div>
            </div>

            <hr className="my-6" />

            {/* Totals */}
            <div className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>

                <span>
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {product.product_shipping_fee}
                </span>
              </div>

              <div className="flex justify-between text-xl font-bold text-slate-900 border-t pt-4">
                <span>Total</span>

                <span>
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {totalCost}
                </span>
              </div>
            </div>

            {/* Payment */}
            {selectedAddress ? (
              <button
                onClick={payNow}
                className="
                mt-6
                w-full
                rounded-xl
                bg-[#043033]
                py-4
                font-semibold
                text-white
                hover:bg-black
                transition
              "
              >
                Pay Now
              </button>
            ) : (
              <div
                className="
                mt-6
                rounded-xl
                bg-amber-50
                border
                border-amber-200
                p-4
                text-sm
                text-amber-700
              "
              >
                Please select a delivery address to continue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;
