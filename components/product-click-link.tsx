"use client";

/* Komponent klikalnego linku dla karty produktu */

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function ProductClickLink({
  href,
  children,
  className,
  onClick,
}: Props) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
