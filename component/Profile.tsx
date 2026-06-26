import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
const supabase = await createClient();

const {
data: { user },
} = await supabase.auth.getUser();

if (!user) {
redirect("/login");
}

// User profile
const { data: profile } = await supabase
.from("obra_users")
.select("*")
.eq("id", user.id)
.single();

// Total orders
const { count: totalOrders } = await supabase
.from("orders")
.select("*", { count: "exact", head: true })
.eq("user_id", user.id);

// Completed orders
const { count: completedOrders } = await supabase
.from("orders")
.select("*", { count: "exact", head: true })
.eq("user_id", user.id)
.eq("status", "delivered");

// First order date
const { data: firstOrder } = await supabase
.from("orders")
.select("created_at")
.eq("user_id", user.id)
.order("created_at", { ascending: true })
.limit(1)
.single();

const customerSince = firstOrder
? new Date(firstOrder.created_at).toLocaleDateString()
: "No orders yet";

return ( <section className="mx-auto max-w-5xl p-6"> <h1 className="mb-8 text-3xl font-bold">
My Profile </h1>

  <div className="grid gap-6 md:grid-cols-2">

    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Personal Information
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-gray-500">
            Full Name
          </p>
          <p className="font-medium">
            {profile?.full_name || "Not set"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Email
          </p>
          <p className="font-medium">
            {profile?.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Referral Code
          </p>
          <p className="font-medium">
            {profile?.referral_code || "Not available"}
          </p>
        </div>

      </div>
    </div>

    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Shopping Statistics
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-gray-500">
            Customer Since
          </p>
          <p className="font-medium">
            {customerSince}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Orders
          </p>
          <p className="text-2xl font-bold">
            {totalOrders ?? 0}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Completed Orders
          </p>
          <p className="text-2xl font-bold text-green-600">
            {completedOrders ?? 0}
          </p>
        </div>

      </div>
    </div>

  </div>
</section>

);
}
