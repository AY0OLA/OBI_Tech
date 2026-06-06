import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function fetchProducts() {
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return products;
}