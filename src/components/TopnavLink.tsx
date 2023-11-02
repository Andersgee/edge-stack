"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "#src/utils/cn";

type Props = { href: string; label: string };

export function TopnavLink({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      className={cn(
        "focus-visible::focusring rounded-sm px-3 py-2 text-color-neutral-700 outline-none hover:bg-color-neutral-200 hover:text-color-neutral-950",
        isActive && "text-color-neutral-900 underline"
      )}
      href={href}
    >
      {label}
    </Link>
  );
}
