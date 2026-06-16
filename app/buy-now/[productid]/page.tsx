import BuyNowPage from "@/component/BuyNowPage";
import { fetchAddresses } from "@/utils/action/address.actions";
import { fetchProductById } from "@/utils/action/product.action";

export default async function BuyNow({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await fetchProductById(productId);
  const addresses = await fetchAddresses();
  return <BuyNowPage product={product} addresses={addresses} />;
}
