import ReviewOrderPage from "@/component/ReviewOrderPage";
import { fetchOrderById } from "@/utils/action/order.actions";

export default async function AddReview({
  params,
}: {
  params: Promise<{ orderid: string }>;
}) {
  const { orderid } = await params;
  
  const orderData = await fetchOrderById(orderid);

  return (
    <>
      <ReviewOrderPage orderData={orderData} />
    </>
  );
}
