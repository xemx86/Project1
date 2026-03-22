import Link from "next/link";
import Image from "next/image";
import { AuthStatus } from "@/components/auth-status";
import { CartLink } from "@/components/cart-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

export async function Header({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={`/${lang}`} className="brand">
          <Image
            src="/logo.png"
            alt="Natan Snikers"
            className="brand__logo"
            width={220
            }
            height={120}
            priority
          />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${lang}`}>{dict.nav.home}</Link>
          <Link href={`/${lang}/sklep`}>{dict.nav.shop}</Link>
          <Link href={`/${lang}/koszyk`}>{dict.nav.cart}</Link>
          <Link href={`/${lang}/admin`}>{dict.nav.admin}</Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <CartLink lang={lang} />
          <AuthStatus lang={lang} />
        </div>
      </div>
    </header>
  );
}
