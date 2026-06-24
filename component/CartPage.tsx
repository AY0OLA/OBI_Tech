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
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const { items, increaseQty, decreaseQty, removeItem } = cartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams>();
  const [totalCost, setTotalCost] = useState<number>(0);
  const [deducedShippingFee, setDeducedShippingFee] = useState(0);
  const { session } = useAppContext();
  useEffect(() => {
    setTotalCost(
      items.reduce((total, item) => {
        return total + item.price * item.cartQuantity;
      }, 0),
    );

    setDeducedShippingFee(
      items.reduce((total, item) => {
        return total + item.product_shipping_fee * item.cartQuantity;
      }, 0),
    );

    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress =
        addresses.find((address) => address.is_default) || addresses[0];

      setSelectedAddress(defaultAddress);
    }
  }, [items, addresses]);
  const payNow = async () => {
    try {
      setIsPaying(true);

      const result = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: (totalCost + deducedShippingFee) * 100,
          source: "cart",
        }),
      });

      const paystackResult = await result.json();

      if (result.ok && paystackResult.status) {
        localStorage.setItem(
          "paymentInformation",
          JSON.stringify({
            userId: session?.user?.id,
            userEmail: session?.user?.email,
            fullAddressFields: selectedAddress,
            items,
            amount: (totalCost + deducedShippingFee) * 100,
          }),
        );

        router.push(paystackResult.data.authorization_url);
        return;
      }

      toast.error("Unable to initialize payment.");
    } catch (error) {
      console.log("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const formatPrice = (price: number) =>
    price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const totalItems = items.reduce((sum, item) => sum + item.cartQuantity, 0);
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
            onClick={() => router.push("/all-products")}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Shopping Cart
                </h1>

                <p className="mt-2 text-slate-500">
                  Review your items and proceed to checkout.
                </p>
              </div>

              <p className="mt-4 md:mt-0 text-lg font-medium text-[#043033]">
                {totalItems} Item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((eachItem) => (
                    <tr key={eachItem.id} className="border-t border-slate-100">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <Image
                              src={eachItem.image_url_array[0]}
                              alt={eachItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {eachItem.name}
                            </h3>

                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Remove ${eachItem.name} from your cart?`,
                                  )
                                ) {
                                  removeItem(eachItem.id);
                                  toast.success("Item removed from cart");
                                }
                              }}
                              className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-700 font-medium">
                        {process.env.NEXT_PUBLIC_CURRENCY}{" "}
                        {formatPrice(eachItem.price)}
                        {console.log(eachItem)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => decreaseQty(eachItem.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100"
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease"
                              className="w-4 h-4"
                            />
                          </button>

                          <input
                            readOnly
                            value={eachItem.cartQuantity}
                            className="w-12 h-10 rounded-lg border border-slate-300 text-center font-medium"
                          />

                          <button
                            type="button"
                            onClick={() => increaseQty(eachItem.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100"
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#043033]">
                        {process.env.NEXT_PUBLIC_CURRENCY}{" "}
                        {formatPrice(eachItem.price * eachItem.cartQuantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => router.push("/all-products")}
              className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#043033]
              px-5
              py-3
              text-white
              transition
              hover:bg-black
            "
            >
              <Image
                src={assets.arrow_right_icon_colored}
                alt="arrow"
                className="w-4 h-4"
              />
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div
            className="
            w-full
            lg:w-[420px]
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            h-fit
            sticky
            top-6
          "
          >
            <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

            <hr className="my-6 border-slate-200" />

            <div>
              <label className="block mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                Delivery Address
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen((prev) => !prev);
                  }}
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
                "
                >
                  {selectedAddress
                    ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Select Address"}
                </button>

                {isDropdownOpen && (
                  <ul
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
                  "
                  >
                    {userAddresses.map((address) => (
                      <li
                        key={address.id}
                        onClick={() => {
                          setSelectedAddress(address);
                          setIsDropdownOpen(false);
                        }}
                        className="
                        cursor-pointer
                        px-4
                        py-3
                        hover:bg-slate-100
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

            <hr className="my-6 border-slate-200" />

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-slate-600">Items ({totalItems})</p>

                <p className="font-medium">
                  {process.env.NEXT_PUBLIC_CURRENCY} {formatPrice(totalCost)}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-slate-600">Shipping Fee</p>

                <p className="font-medium">
                  {process.env.NEXT_PUBLIC_CURRENCY}{" "}
                  {formatPrice(deducedShippingFee)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-5 flex justify-between items-center">
                <p className="uppercase tracking-wide text-slate-600 font-semibold">
                  Grand Total
                </p>

                <p className="text-[#043033] text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_CURRENCY}{" "}
                  {formatPrice(totalCost + deducedShippingFee)}
                </p>
              </div>
            </div>

            {selectedAddress ? (
              <button
                type="button"
                disabled={isPaying}
                onClick={payNow}
                className="mt-6 w-full rounded-xl bg-[#043033] py-4 font-semibold text-white transition hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPaying ? "Processing..." : "Pay Now"}
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-center text-amber-700 text-sm">
                Please select a delivery address to continue.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
