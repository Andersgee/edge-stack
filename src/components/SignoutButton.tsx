"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "#src/utils/cn";

type Props = ComponentPropsWithoutRef<"a">;

export function SignoutButton({ children, className, ...props }: Props) {
  const pathname = usePathname();

  return (
    <a href={`/api/auth/signout?route=${pathname}`} className={cn("px-3 py-2", className)} {...props}>
      {children}
    </a>
  );
}
