import { ReactNode } from "react";
import { Header } from "@/components/header";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Header lang={lang as "en" | "es"} />
      <main>{children}</main>
    </>
  );
}
