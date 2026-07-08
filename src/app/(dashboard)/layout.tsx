import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Administración");

export default function DashboardLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
