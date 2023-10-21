"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
};

export function SignoutButton({ children }: Props) {
  const pathname = usePathname();

  return (
    <Button asChild variant="outline">
      <a href={`/api/auth/signout?route=${pathname}`}>{children}</a>
    </Button>
  );
}
