"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assets } from "@/public/assests/assets";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { saveAddressDB } from "@/utils/action/address.actions";

const NewAddress = () => {
  const router = useRouter();
  const [userAddressDetails, setUserAddressDetails] = useState({
    region: "",
    title: "",
    address: "",
    state: "",
    city: "",
    phone: "",
    flag: "",
    countryCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<{
    region: string;
    code: string;
    flag: string;
  }>();
  const regionRef = useRef<HTMLDivElement>(null);
  const allRegions = [
    { region: "Nigeria", code: "+234", flag: "🇳🇬" },
    { region: "Ghana", code: "+233", flag: "🇬🇭" },
  ];

  const disabled =
    !userAddressDetails.region ||
    !userAddressDetails.title ||
    !userAddressDetails.address ||
    !userAddressDetails.state ||
    !userAddressDetails.city ||
    !userAddressDetails.phone;

  const handleAddress = async () => {
    try {
      if (
        !userAddressDetails.address ||
        !userAddressDetails.region ||
        !userAddressDetails.phone ||
        !userAddressDetails.state ||
        !userAddressDetails.title
      ) {
        return;
      }
      //call function to save address to supabase database
      const saveResult = await saveAddressDB(userAddressDetails);

      if (saveResult.success === false) {
        toast.error("Your address wasn't saved yet. Please try again.");
        return;
      }

      toast.success("Address saved successfully");
      setUserAddressDetails({
        region: "",
        title: "",
        address: "",
        state: "",
        city: "",
        phone: "",
        flag: "",
        countryCode: "",
      });
      router.back();
    } catch (error) {
      console.log("error saving address", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        regionRef.current &&
        !regionRef.current.contains(event.target as Node)
      ) {
        setOpenRegion(false);
      }
    };

    const handleScroll = () => {
      setOpenRegion(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Form Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Add Shipping Address
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your delivery details below.
            </p>
          </div>

          <div className="space-y-5">
            {/* Country / Region */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Country / Region
              </label>

              <div className="relative">
                <button
                  onClick={() => setOpenRegion(!openRegion)}
                  type="button"
                  className="
                  w-full
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-700
                  hover:border-[#1a9376]
                  transition
                "
                >
                  <span>
                    {userAddressDetails.region || "Select Country / Region"}
                  </span>

                  <svg
                    className={`h-5 w-5 transition-transform ${
                      openRegion ? "rotate-180" : ""
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

                <input
                  type="hidden"
                  name="region"
                  value={userAddressDetails.region.trim()}
                />

                {openRegion && (
                  <div
                    ref={regionRef}
                    className="
                    absolute
                    z-50
                    mt-2
                    w-full
                    max-h-64
                    overflow-y-auto
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                  "
                  >
                    {allRegions.map((eachRegion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setUserAddressDetails((prevState) => ({
                            ...prevState,
                            region: eachRegion.region.trim(),
                            countryCode: eachRegion.code.trim(),
                            flag: eachRegion.flag.trim(),
                          }));

                          setSelectedRegion(eachRegion);
                          setOpenRegion(false);
                        }}
                        className="
                        block
                        w-full
                        px-4
                        py-3
                        text-left
                        text-slate-700
                        hover:bg-slate-50
                      "
                      >
                        {eachRegion.flag} {eachRegion.region}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Region Display */}
            {userAddressDetails.region && (
              <div className="rounded-xl bg-[#1a9376]/10 px-4 py-3">
                <p className="font-medium text-[#1a9376]">
                  {userAddressDetails.region}
                </p>
              </div>
            )}

            {/* Title */}
            <input
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#1a9376]
              focus:ring-2
              focus:ring-[#1a9376]/20
            "
              type="text"
              placeholder="Address Title (e.g. Home, Office)"
              value={userAddressDetails.title}
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  title: e.target.value,
                })
              }
            />

            {/* Address */}
            <textarea
              rows={4}
              placeholder="Full Address"
              value={userAddressDetails.address}
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  address: e.target.value,
                })
              }
              className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#1a9376]
              focus:ring-2
              focus:ring-[#1a9376]/20
            "
            />

            {/* State */}
            <input
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#1a9376]
              focus:ring-2
              focus:ring-[#1a9376]/20
            "
              type="text"
              placeholder="State"
              value={userAddressDetails.state}
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  state: e.target.value,
                })
              }
            />

            {/* City */}
            <input
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#1a9376]
              focus:ring-2
              focus:ring-[#1a9376]/20
            "
              type="text"
              placeholder="City"
              value={userAddressDetails.city}
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  city: e.target.value,
                })
              }
            />

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <div className="flex">
                <div
                  className="
                  flex
                  items-center
                  px-4
                  border
                  border-r-0
                  border-slate-300
                  rounded-l-xl
                  bg-slate-50
                  min-w-[100px]
                "
                >
                  {selectedRegion?.flag}
                  <span className="ml-2">{selectedRegion?.code}</span>
                </div>

                <input
                  disabled={!userAddressDetails.region}
                  type="tel"
                  placeholder="Phone Number"
                  value={userAddressDetails.phone}
                  onChange={(e) =>
                    setUserAddressDetails({
                      ...userAddressDetails,
                      phone: e.target.value,
                    })
                  }
                  className="
                  flex-1
                  rounded-r-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#1a9376]
                "
                />
              </div>
            </div>

            {/* Preview */}
            {userAddressDetails.region && userAddressDetails.phone && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  {selectedRegion?.code} {userAddressDetails.phone}
                </p>
              </div>
            )}

            {/* Errors */}
            {!userAddressDetails.region && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                Please select a country/region.
              </div>
            )}

            {disabled && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                All fields must be filled before continuing.
              </div>
            )}

            {/* Submit */}
            <button
              disabled={disabled}
              onClick={handleAddress}
              className={`
              w-full
              rounded-xl
              py-4
              font-semibold
              text-white
              transition
              ${
                disabled
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#1a9376] hover:bg-black"
              }
            `}
            >
              {loading ? "Saving Address..." : "Save Address"}
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex justify-center">
          <Image
            src={assets.my_location_image}
            alt="Location Illustration"
            className="max-w-lg w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default NewAddress;
