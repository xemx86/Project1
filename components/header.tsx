"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f1eb]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          KICKRUSH LUXE
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/#new-arrivals">New Arrivals</Link>
          <Link href="/#shop">Shop</Link>
        </nav>
      </div>
    </header>
  );
}
