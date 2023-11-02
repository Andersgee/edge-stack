"use client";

//import { apiRsc } from "#src/trpc/api-rsc";
import Link from "next/link";
import { ProfileButton } from "./ProfileButton";
import { useStore } from "#src/store";
import { usePathname } from "next/navigation";
import { cn } from "#src/utils/cn";
import { BorderWithLabel } from "./BorderWithLabel";

export function Topnav() {
  //const { user } = await apiRsc();
  const user = useStore.use.user();

  return (
    <BorderWithLabel label="Topnav">
      <div className="m-2 flex items-center justify-between">
        <div>
          <div className="flex">
            <NavLink label="Home" href="/" />
            <NavLink label="Slow" href="/slow" />
            <NavLink label="Slow with suspense" href="/slow-with-suspense" />
          </div>
        </div>
        <div>
          <ProfileButton user={user} />
        </div>
      </div>
    </BorderWithLabel>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
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
