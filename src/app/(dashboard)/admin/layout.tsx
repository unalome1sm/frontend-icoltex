import { AdminLayoutClient } from "./AdminLayoutClient";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Panel de administración");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
