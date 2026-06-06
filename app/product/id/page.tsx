import ProductDetails from "@/component/ProductDetails";
import { fetchProductById } from "@/utils/action/product.action";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);
  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
}
