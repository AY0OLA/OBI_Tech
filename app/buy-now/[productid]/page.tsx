import BuyNowPage from "@/component/BuyNowPage";
import { fetchAddresses } from "@/utils/action/address.actions";
import { fetchProductById } from "@/utils/action/product.action";

export default async function BuyNow({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  const { productid } = await params;

  const product = await fetchProductById(productid);
  const addresses = await fetchAddresses();

  return <BuyNowPage product={product} addresses={addresses} />;
}
