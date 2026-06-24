import { VerifyPay } from "@/component/VerifyPay";
import { checkOrder } from "@/utils/action/order.actions";
import { redirect } from "next/navigation";

export default async function VerifyPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { reference } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const orderExist = await checkOrder(reference);

  if (orderExist && orderExist.length > 0) {
    redirect("/");
  }

  const response = await fetch(`${baseUrl}/api/verifyPayment/${reference}`, {
    cache: "no-store",
  });

  const result = await response.json();
  // console.log("Payment Verification Result:", result);

  return (
    <VerifyPay
      reference={reference}
      amount={result.data.amount}
      email={result.data.customer.email}
    />
  );
}
