import CartPage from "@/component/CartPage";
import { fetchAddresses } from "@/utils/action/address.actions";

export default async function Cart() {
  const addresses = await fetchAddresses();
  return (
    <>
      {" "}
      <CartPage addresses={addresses} />
    </>
  );
}
