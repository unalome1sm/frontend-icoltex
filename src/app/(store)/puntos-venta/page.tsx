import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function PuntosVentaRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const ciudad = params.ciudad;
  const query = typeof ciudad === "string" && ciudad ? `?ciudad=${encodeURIComponent(ciudad)}` : "";
  redirect(`/stores${query}`);
}
