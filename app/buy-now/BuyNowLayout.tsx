import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type BuyNowLayoutProps = {
  children: React.ReactNode;
};

export default async function BuyNowLayout({ children }: BuyNowLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>{user && <div>{children}</div>}</div>;
}
