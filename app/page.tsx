import HeaderSlider from "@/component/HeaderSlider";
import { Navbar } from "@/component/Navbar";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <div>
        <HeaderSlider />
      </div>
    </div>
  );
}
