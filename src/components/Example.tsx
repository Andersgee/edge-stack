"use client";

import { useStore } from "#src/store";
import { SigninButtons } from "./SigninButtons";

type Props = {
  className?: string;
};

export function Example({ className }: Props) {
  const user = useStore.select.user();

  return (
    <div className={className}>
      <div>Example</div>
      <div className="my-3 bg-slate-200 px-3">hello</div>
      {user ? <div>signed in as {user.name}</div> : <SigninButtons />}
    </div>
  );
}
