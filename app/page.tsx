import Footer from "@/component/Footer";
import HeaderSlider from "@/component/HeaderSlider";
import HomeProducts from "@/component/HomeProducts";
import { Navbar } from "@/component/Navbar";
import { fetchProducts } from "@/utils/action/product.action";
import React from "react";
export const dynamic = "force-dynamic";
export default async function Page() {
  const allProducts = await fetchProducts();
  
  return (
    <div>
      <Navbar />
      <div>
        <HeaderSlider />

        <HomeProducts products={allProducts} />
        <Footer />
      </div>
    </div>
  );
}
