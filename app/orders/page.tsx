import UserOrders from "@/component/UserOrders";
import { fetchUserOrders } from "@/utils/action/order.actions";

export default async function Orders() {
  const userOrders = await fetchUserOrders();

  return <UserOrders userOrders={userOrders} />;
}
