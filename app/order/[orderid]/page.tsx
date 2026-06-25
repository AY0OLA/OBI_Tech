import { notFound } from "next/navigation";
import OrderPage from "@/component/OrderPage";
import { fetchOrderById } from "@/utils/action/order.actions";

export default async function Order({
  params,
}: {
  params: Promise<{ orderid: string }>;
}) {
  const { orderid } = await params;

  const orderData = await fetchOrderById(orderid);

  if (!orderData) {
    notFound();
  }

  return <OrderPage orderData={orderData} />;
}
