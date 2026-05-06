import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/queries/profile";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/portal");
  return <>{children}</>;
}
