"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";

const OrderPage = ({ orderData }: { orderData: OrderParams }) => {
 return (
   <div className="min-h-screen bg-slate-50">
     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
       {/* Header */}
       <div className="mb-8">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
           Order Details
         </h1>

         <p className="mt-2 text-slate-500">
           View information about your order and delivery details.
         </p>
       </div>

       {/* Main Card */}
       <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
           {/* Product Image */}
           <div>
             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
               <Image
                 src={orderData.image_url}
                 alt={orderData.product_name}
                 width={1200}
                 height={1200}
                 className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition
                  duration-500
                "
               />
             </div>
           </div>

           {/* Order Information */}
           <div className="flex flex-col">
             <div>
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                 {orderData.product_name}
               </h2>

               <p className="mt-4 text-4xl font-bold text-[#043033]">
                 {process.env.NEXT_PUBLIC_CURRENCY}
                 {orderData.amount_paid}
               </p>
             </div>

             <hr className="my-8 border-slate-200" />

             {/* Delivery Information */}
             <div>
               <h3 className="mb-4 text-lg font-semibold text-slate-900">
                 Delivery Information
               </h3>

               <div className="space-y-3">
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">Region</span>
                   <span className="font-medium text-slate-800">
                     {orderData.region}
                   </span>
                 </div>

                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">State</span>
                   <span className="font-medium text-slate-800">
                     {orderData.state}
                   </span>
                 </div>

                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">City</span>
                   <span className="font-medium text-slate-800">
                     {orderData.city}
                   </span>
                 </div>

                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500">Phone</span>
                   <span className="font-medium text-slate-800">
                     {orderData.country_code}
                     {orderData.phone}
                   </span>
                 </div>
               </div>
             </div>

             {/* Status */}
             <div className="mt-8">
               <h3 className="mb-3 text-lg font-semibold text-slate-900">
                 Order Status
               </h3>

               <span
                 className={`
                  inline-flex
                  items-center
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  ${
                    orderData.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : orderData.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : orderData.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                  }
                `}
               >
                 {orderData.status}
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default OrderPage;
