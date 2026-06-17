"use client";

import { assets } from "@/public/assests/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import HamX from "./HamX";
import { useAppContext } from "@/context/AppContext";
import { signOut } from "@/utils/action/userAuth.action";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { session, setSession } = useAppContext();
  
  const router = useRouter();


  const checkIn = () => {
    setUserOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    router.push("/");
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 text-white bg-black ">
      <Link href="/">
        <h1 className="text-[#fce3c7]">OBI-Tech</h1>
      </Link>
      <div className="flex items-center gap-6 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-400 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-400 transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-gray-400 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-400 transition">
          Contact
        </Link>
      </div>

      <div>
        <ul className="hidden md:flex items-center gap-4 ">
          <button >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.heart_icon} alt="favorite" className="w-4" />
          </button>

          <Link
            href={"/cart"}
            className="flex items-center gap-2 hover:text-gray-400 transition"
          >
            <Image src={assets.cart_icon} alt="cart" />
          </Link>

          <button
            onClick={checkIn}
            className="flex items-center gap-2 hover:text-gray-400 transition"
          >
            <Image src={assets.user_icon} alt="user" />
          </button>
        </ul>
        {/* for mobile view */}
        <div className=" md:hidden flex items-center justify-center gap-3">
          <button>
            <Image className="w-6 h-6" src={assets.search_icon} alt="search" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.cart_icon} alt="cart" className="w-6 h-6" />
          </button>
          <button
            onClick={checkIn}
            className="flex items-center gap-2 hover:text-gray-400 transition"
          >
            <Image src={assets.user_icon} alt="user" className="w-6 h-6" />
          </button>

          <HamX isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        {userOpen && (
          <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            {session ? (
              <>
                {/* User Info */}
                <div className="border-b border-gray-100 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Signed in as
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-gray-900">
                    {session.user.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/reviews"
                    className="flex items-center rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Reviews
                  </Link>
                </div>

                {/* Sign Out */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="p-5">
                <p className="mb-4 text-sm text-gray-500">
                  Sign in to view your account and orders.
                </p>

                <Link
                  href="/login"
                  className="block w-full rounded-xl bg-[#043033] py-3 text-center text-sm font-medium text-white hover:bg-[#022224] transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-[70%] h-full flex flex-col flex-full bg-black text-white top-[52px] right-0 z-10">
          <div className="flex flex-col items-center gap-6  mt-16">
            <Link href="/" className="hover:text-gray-400 transition">
              Home
            </Link>
            <Link
              href="/all-products"
              className="hover:text-gray-400 transition"
            >
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-400 transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition">
              Contact
            </Link>

            <Link
              href="/favorites"
              className="flex items-center gap-2 hover:text-gray-400 transition"
            >
              Favorites
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
