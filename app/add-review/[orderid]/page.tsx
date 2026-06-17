import ReviewOrderPage from "@/component/ReviewOrderPage";
import { fetchOrderById } from "@/utils/action/order.actions";

export default async function AddReview({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  
  const orderData = await fetchOrderById(orderId);

  return (
    <>
      <ReviewOrderPage orderData={orderData} />
    </>
  );
}
