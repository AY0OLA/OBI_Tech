import Footer from "@/component/Footer";
import HeaderSlider from "@/component/HeaderSlider";
import HomeProducts from "@/component/HomeProducts";
import { Navbar } from "@/component/Navbar";
import { fetchProducts } from "@/utils/action/product.action";
import React from "react";

const allProducts = await fetchProducts();
export default async function Page() {
  
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
