import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Locale } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Header lang={lang} />
      <main>{children}</main>
    </>
  );
}
