import { StoreLayout } from "@/components/layout";

export default function StoreLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreLayout>{children}</StoreLayout>;
}
