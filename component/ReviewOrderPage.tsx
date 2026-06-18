"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";
import { useState } from "react";
import StarRating from "./StarRating";
import {
  reviewImagesSchema,
  reviewSchema,
} from "@/utils/zodvalidations/review-validations";
import toast from "react-hot-toast";
import {
  uploadImagesToSupabase,
  createReview,
} from "@/utils/action/reviews.actions";
import { useRouter } from "next/navigation";

const ReviewOrderPage = ({ orderData }: { orderData: OrderParams }) => {
  const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [productRating, setProductRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Array<Record<string, string>>>(
    [],
  );
  const [imagesError, setImagesError] = useState<string[]>([]);

  const colorDisabled =
    !reviewTitle || !reviewDescription || reviewImageFiles.length <= 0;

  const handleSubmitReview = async () => {
    let localError = false;
    const reviewFormValidation = reviewSchema.safeParse({
      reviewTitle,
      reviewDescription,
    });

    const reviewImagesValidation = reviewImagesSchema.safeParse({
      reviewImages: reviewImageFiles,
    });

    const reviewResult = reviewFormValidation.error?.issues.map((each) => {
      return { [each.path[0]]: each.message };
    });

    if (reviewResult) {
      localError = true;
      setFormErrors(reviewResult);
    }

    if (reviewImagesValidation.error?.issues) {
      localError = true;
      setImagesError(
        reviewImagesValidation.error.issues.map((each) => each.message),
      );
    }

    if (localError) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      const imageReviewsFormData = new FormData();
      reviewImageFiles.forEach((file) => {
        imageReviewsFormData.append("reviewImages", file);
      });
      const imageUrlsInSupabase =
        await uploadImagesToSupabase(imageReviewsFormData);

      if (imageUrlsInSupabase.success) {
        const { reviewData } = await createReview({
          orderToReview: orderData,
          reviewData: {
            reviewTitle,
            reviewDescription,
            productRating,
            deliveryRating,
            reviewImageUrls: imageUrlsInSupabase.imageUrls || [],
          },
        });
        if (reviewData) {
          toast.success("Review created successfully!");
          router.push("/");
        } else {
          toast.error("Failed to create review. Please try again.");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setReviewTitle("");
      setReviewDescription("");
      setProductRating(5);
      setDeliveryRating(5);
      setReviewImageFiles([]);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Write a Review
          </h1>

          <p className="mt-2 text-slate-500">
            Share your experience with this product.
          </p>
        </div>

        {/* Product Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image
                  src={orderData.image_url}
                  alt={orderData.product_name}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {orderData.product_name}
              </h2>

              <p className="mt-4 text-4xl font-bold text-[#043033]">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {orderData.amount_paid}
              </p>

              <hr className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Region</span>
                  <span className="font-medium">{orderData.region}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">State</span>
                  <span className="font-medium">{orderData.state}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">City</span>
                  <span className="font-medium">{orderData.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Your Review
          </h2>

          <div className="space-y-6">
            {/* Upload Images */}
            <div>
              <label className="block mb-3 text-sm font-semibold text-slate-700">
                Review Images
              </label>

              <label
                htmlFor="imageFiles"
                className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-slate-300
                bg-slate-50
                p-8
                cursor-pointer
                hover:border-[#043033]
                hover:bg-slate-100
                transition
              "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-10 w-10 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Upload Review Images
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  PNG, JPG, JPEG or GIF
                </p>

                <input
                  id="imageFiles"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    setImagesError([]);

                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];

                    setReviewImageFiles(files);
                  }}
                />
              </label>

              {/* Preview Images */}
              {reviewImageFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {reviewImageFiles.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);

                    return (
                      <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <Image
                          src={previewUrl}
                          alt={`Review image ${index + 1}`}
                          width={300}
                          height={300}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {imagesError.map((error, index) => (
                <p key={index} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            {/* Review Title */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Review Title
              </label>

              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => {
                  setFormErrors([]);
                  setReviewTitle(e.target.value);
                }}
                placeholder="Summarize your experience"
                className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-[#043033]
                focus:ring-2
                focus:ring-[#043033]/20
              "
              />

              {formErrors.map(
                (error, index) =>
                  error.reviewTitle && (
                    <p key={index} className="mt-2 text-sm text-red-500">
                      {error.reviewTitle}
                    </p>
                  ),
              )}
            </div>

            {/* Review Description */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Review Description
              </label>

              <textarea
                rows={5}
                value={reviewDescription}
                onChange={(e) => {
                  setFormErrors([]);
                  setReviewDescription(e.target.value);
                }}
                placeholder="Tell other customers about your experience..."
                className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-[#043033]
                focus:ring-2
                focus:ring-[#043033]/20
              "
              />

              {formErrors.map(
                (error, index) =>
                  error.reviewDescription && (
                    <p key={index} className="mt-2 text-sm text-red-500">
                      {error.reviewDescription}
                    </p>
                  ),
              )}
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 font-medium text-slate-700">
                  Product Rating
                </label>

                <div className="rounded-xl border border-slate-200 p-4">
                  <StarRating
                    rating={productRating}
                    setRating={setProductRating}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-3 font-medium text-slate-700">
                  Delivery Rating
                </label>

                <div className="rounded-xl border border-slate-200 p-4">
                  <StarRating
                    rating={deliveryRating}
                    setRating={setDeliveryRating}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitReview}
              disabled={colorDisabled}
              className={`
              w-full
              md:w-auto
              rounded-xl
              px-8
              py-4
              font-semibold
              text-white
              transition
              ${
                colorDisabled
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#043033] hover:bg-black"
              }
            `}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
