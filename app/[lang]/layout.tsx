import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { isLocale, locales } from "@/lib/i18n";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return (
    <>
      <Header lang={lang} />
      <CartProvider>
        <main className="page-shell">{children}</main>
      </CartProvider>
      <Footer />
    </>
  );
}
