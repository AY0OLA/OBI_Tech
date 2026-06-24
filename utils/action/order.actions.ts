"use server";

import { OrderParams } from "@/shared.types";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

interface OrderItemsParams {
  amount: number;
  user_email: string;
  productName: string;
  quantity: number;
  productCategory: string;
  productImage: string;
  address: {
    address: string;
    city: string;
    country_code: string;
    created_at: string;
    flag: string;
    is_default: boolean;
    phone: string;
    region: string;
    state: string;
    title: string;
  };
  paymentReference: string;
}

export async function createOrder(orderItems: OrderItemsParams) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
   redirect("/login");
  }

  const { data: orderData, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      user_email: orderItems.user_email,
      amount_paid: orderItems.amount,
      product_name: orderItems.productName,
      product_category: orderItems.productCategory,
      quantity_bought: orderItems.quantity,
      image_url: orderItems.productImage,
      status: "processing",
      region: orderItems.address.region,
      state: orderItems.address.state,
      city: orderItems.address.city,
      address: orderItems.address.address,
      phone: orderItems.address.phone,
      country_code: orderItems.address.country_code,
      reference_paystack: orderItems.paymentReference,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    throw new Error(error.message);
  }

  // console.log("Created order:", orderData);

  return orderData.id;
}

export async function checkOrder(reference: string) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const { data: referenceFromPaystack, error } = await supabase
    .from("orders")
    .select("reference_paystack")
    .eq("user_id", userId)
    .eq("reference_paystack", reference)
    .select();

  if (error) {
    console.log("error getting reference", error);
    return;
  }

  return referenceFromPaystack;
}

export async function fetchOrderById(orderId: string) {
  // console.log("Fetching order:", orderId);

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Supabase fetch error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  return data;
}

export async function fetchUserOrders(): Promise<OrderParams[]> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const { data: allUserOrders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }

  return allUserOrders;
}
