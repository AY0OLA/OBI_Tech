import { createClient } from "@/utils/supabase/server";
import { ProductParams } from "@/shared.types";

export async function fetchProducts(): Promise<ProductParams[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    return data ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function fetchProductById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories!fk_category (
          name
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}
