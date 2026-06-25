"use client";
import { Navbar } from "@/component/Navbar";

import { assets } from "@/public/assests/assets";
import { AddressParams } from "@/shared.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const CartPage = ({ addresses }: { addresses: AddressParams[] }) => {
  const router = useRouter();
  const { items, decreaseQty, increaseQty, removeItem } = cartStore(
    (state) => state,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams>();
  const [totalCost, setTotalCost] = useState<number>(0);
  const [deducedShippingFee, setDeducedShippingFee] = useState(0);
  const { session } = useAppContext();
  useEffect(() => {
    setTotalCost(
      items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0),
    );

    setDeducedShippingFee(
      items.reduce((total, item) => {
        return total + item.product_shipping_fee * item.quantity;
      }, 0),
    );

    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.filter(
        (eachAddresses) => eachAddresses.is_default === true,
      )[0];
      setSelectedAddress(defaultAddress);
    }
  }, [items, addresses]);

  const payNow = async () => {
    try {
      const result = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: totalCost * 100 + deducedShippingFee * 100,
          source: "cart",
        }),
      });

      const paystackResult = await result.json();

      if (result.status) {
        localStorage.setItem(
          "paymentInformation",
          JSON.stringify({
            userId: session?.user?.id,
            userEmail: session?.user?.email,
            fullAddressFields: selectedAddress,
            items: items,
            amount: totalCost * 100 + deducedShippingFee * 100,
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
  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-[#043033]/10 h-28 w-28 rounded-full flex items-center justify-center mx-auto">
            <Image src={assets.cart_icon} alt="cart" width={50} height={50} />
          </div>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Your Cart Is Empty
          </h2>

          <p className="mt-3 text-slate-500">
            Looks like you haven't added any products yet.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="
            mt-8
            rounded-xl
            bg-[#043033]
            px-8
            py-3
            text-white
            font-medium
            transition
            hover:bg-black
          "
          >
            Start Shopping
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
            {/* CART SECTION */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-6 mb-6">
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  Your <span className="text-[#043033]">Cart</span>
                </p>

                <p className="text-sm md:text-base text-slate-500">
                  {items?.length || 0} items
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                        Product
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                        Price
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                        Qty
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items?.map((eachItem, index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              <Image
                                src={eachItem.image_url_array[0]}
                                alt={eachItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {eachItem.name}
                              </p>

                              <button
                                onClick={() => removeItem(eachItem.id)}
                                className="
                                mt-2
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-red-600
                                hover:bg-red-100
                                transition
                              "
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-slate-700 font-medium">
                          {process.env.NEXT_PUBLIC_CURRENCY}
                          {eachItem.price}
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQty(eachItem.id)}
                              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease"
                                className="w-4 h-4"
                              />
                            </button>

                            <input
                              readOnly
                              value={eachItem.quantity}
                              className="
                              w-12
                              rounded-lg
                              border
                              border-slate-300
                              text-center
                              font-medium
                            "
                            />

                            <button
                              onClick={() => increaseQty(eachItem.id)}
                              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                            >
                              <Image
                                src={assets.increase_arrow}
                                alt="increase"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-5 font-semibold text-slate-900">
                          {process.env.NEXT_PUBLIC_CURRENCY}
                          {(eachItem.price * eachItem.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                className="
                group
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#043033]
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-black
              "
              >
                <Image
                  src={assets.arrow_right_icon_colored}
                  alt="continue"
                  className="group-hover:-translate-x-1 transition"
                />
                Continue Shopping
              </button>
            </div>

            {/* ORDER SUMMARY */}
            <div className="h-fit rounded-3xl border border-slate-200 bg-white shadow-sm p-6 xl:sticky xl:top-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Order Summary
              </h2>

              <hr className="border-slate-200 my-5" />

              <div>
                <label className="mb-2 block text-sm font-semibold uppercase text-slate-600">
                  Delivery Address
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
                    text-slate-700
                    hover:border-[#043033]
                    transition
                  "
                  >
                    <span>
                      {selectedAddress
                        ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
                        : "Select Address"}
                    </span>

                    <svg
                      className={`float-right h-5 w-5 transition ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <ul
                      className="
                      absolute
                      z-20
                      mt-2
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      shadow-lg
                    "
                    >
                      {userAddresses?.map((address, index) => (
                        <li
                          key={index}
                          className="
                          cursor-pointer
                          px-4
                          py-3
                          hover:bg-slate-50
                          transition
                        "
                        >
                          {address.address}, {address.city}, {address.state}
                        </li>
                      ))}

                      <li
                        onClick={() => router.push("/address")}
                        className="
                        cursor-pointer
                        border-t
                        border-slate-200
                        px-4
                        py-3
                        text-center
                        font-medium
                        text-[#043033]
                        hover:bg-slate-50
                      "
                      >
                        + Add New Address
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <hr className="border-slate-200 my-5" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>

                  <span className="font-semibold text-slate-900">
                    {items?.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>

                  <span className="font-semibold text-slate-900">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {deducedShippingFee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold">
                  <span>Total</span>

                  <span>
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {totalCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

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
                  transition
                  hover:bg-black
                "
                >
                  Proceed To Payment
                </button>
              ) : (
                <div
                  className="
                  mt-6
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  py-4
                  text-center
                  font-medium
                  text-amber-700
                "
                >
                  Please select an address to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
