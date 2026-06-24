import { NextResponse } from "next/server";

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    access_code: string;
    authorization_url: string;
    reference: string;
  };
}

export async function POST(request: Request) {
  try {
    console.log("Payment API Request Received");

    const { email, amount, source } = await request.json();

    if (!email || !amount) {
      return NextResponse.json(
        { error: "Email and amount are required" },
        { status: 400 },
      );
    }

    // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_SITE_URL!;
    const callbackUrl =
      source === "buy-now"
        ? `${baseUrl}/verify-payment`
        : `${baseUrl}/verify-payment-cart`;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          callback_url: callbackUrl,
          metadata: {
            source,
          },
        }),
      },
    );
    console.log("Callback URL:", callbackUrl);
    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Paystack Error:", errorBody);

      return NextResponse.json(
        {
          error: "Failed to initialize Paystack transaction",
        },
        {
          status: response.status,
        },
      );
    }

    const result: PaystackResponse = await response.json();

    console.log("Paystack Initialization Result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment API Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  } finally {
    console.log("Payment API Request Processed");
  }
}
