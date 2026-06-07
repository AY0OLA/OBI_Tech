import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ProductParams } from "@/shared.types";

export async function fetchProducts(): Promise<ProductParams[]> {
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return products;
}

export async function fetchProductById(id: string) {
 const cookieStore = await cookies();
 const supabase = createClient(cookieStore);
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*,category:categories!fk_category(name)")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
}
