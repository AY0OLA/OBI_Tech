import { notFound } from "next/navigation";
import OrderPage from "@/component/OrderPage";
import { fetchOrderById } from "@/utils/action/order.actions";

export default async function Order({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const orderData = await fetchOrderById(orderId);

  if (!orderData) {
    notFound();
  }

  return <OrderPage orderData={orderData} />;
}
