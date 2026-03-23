"use client";

import Link from "next/link";
import { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

export function Header({ lang }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f1eb]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href={`/${lang}`}
          className="text-3xl font-extrabold tracking-tight text-[#3b2415]"
        >
          Nathan <span className="text-[#c98a3d]">Sneakers</span>
        </Link>

        <nav className="flex items-center gap-8 text-lg text-[#6d5c50]">
          <Link href={`/${lang}`} className="hover:text-black">
            Home
          </Link>
          <Link href={`/${lang}/shop`} className="hover:text-black">
            Shop
          </Link>
          <Link href={`/${lang}/cart`} className="hover:text-black">
            Cart
          </Link>
          <Link href={`/${lang}/admin`} className="hover:text-black">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
