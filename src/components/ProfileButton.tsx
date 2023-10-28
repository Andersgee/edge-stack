"use client";

import { useStore } from "#src/store";
import type { TokenUser } from "#src/utils/jwt/schema";
import { SigninButtons } from "./SigninButtons";
import { SignoutButton } from "./SignoutButton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { UserImage32x32 } from "./UserImage";

export function ProfileButton({ user }: { user: TokenUser | null }) {
  const dialogValue = useStore.use.dialogValue();
  const dialogAction = useStore.use.dialogAction();

  return (
    <Popover
      open={dialogValue === "profilebutton"}
      onOpenChange={(open) => {
        if (open) {
          dialogAction({ type: "show", name: "profilebutton" });
        } else {
          dialogAction({ type: "hide", name: "profilebutton" });
        }
      }}
    >
      {user ? (
        <>
          <PopoverTrigger className="rounded-md p-[6px] outline-none hover:bg-color-neutral-200 focus-visible:focusring">
            <UserImage32x32 image={user.image} alt={user.image} />
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <div className="mb-2">{user.name}</div>
              <SignoutButton>Sign out</SignoutButton>
            </div>
          </PopoverContent>
        </>
      ) : (
        <>
          <PopoverTrigger asChild>
            <Button variant="outline">Sign in</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <SigninButtons />
            </div>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
