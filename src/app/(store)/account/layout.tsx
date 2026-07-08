import { AccountLayoutClient } from "./AccountLayoutClient";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Mi cuenta");

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
