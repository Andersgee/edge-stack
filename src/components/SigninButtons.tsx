"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconDiscord, IconGithub, IconGoogle } from "./IconsSpecial";

function useBrowserIsConsideredSafeForOauth() {
  const [browserInfo, setBrowserInfo] = useState({ userAgent: "unkown", isConsideredSafeForOauth: true });

  useEffect(() => {
    if ("userAgent" in navigator) {
      const ua = navigator.userAgent;
      if (ua.match(/FBAN|FBAV/i)) {
        // Facebook in-app browser detected
        setBrowserInfo({ userAgent: ua, isConsideredSafeForOauth: false });
      } else {
        //setBrowserInfo({ userAgent: ua, isConsideredSafeForOauth: true });
      }
    }
  }, []);

  return browserInfo;
}

const linkStyles =
  "bg-color-unthemed-neutral-0 hover:bg-color-unthemed-neutral-100 focus:bg-color-unthemed-neutral-200 text-color-unthemed-neutral-1000 mb-4 flex w-64 items-center justify-around p-3 font-medium shadow-md transition duration-100 ease-out hover:ease-in";

export function SigninButtons() {
  const pathname = usePathname();
  const browserInfo = useBrowserIsConsideredSafeForOauth();

  if (!browserInfo.isConsideredSafeForOauth) {
    return (
      <div className="bg-color-unthemed-neutral-0 p-4">
        <p className="text-color-unthemed-neutral-800 mb-2 text-sm font-semibold">
          Cant sign in with Facebook in-app browser
        </p>
        <p className="text-color-unthemed-neutral-800 text-sm">
          Please use a normal browser like Chrome, Safari, Firefox etc.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-color-unthemed-neutral-0 p-4 shadow-md">
      <div>
        <a href={`/api/auth/signin/google?route=${pathname}`} className={linkStyles}>
          <IconGoogle />
          <span>Sign in with Google</span>
        </a>
      </div>
      <div>
        <a href={`/api/auth/signin/discord?route=${pathname}`} className={linkStyles}>
          <IconDiscord />
          <span>Sign in with Discord</span>
        </a>
      </div>
      <div>
        <a href={`/api/auth/signin/github?route=${pathname}`} className={linkStyles}>
          <IconGithub />
          <span>Sign in with Github</span>
        </a>
      </div>
      <p className="text-color-unthemed-neutral-600 mt-3 w-64 text-center font-serif text-sm">
        By signing in, you agree to our <br />
        <Link
          className="text-color-unthemed-neutral-600 hover:text-color-unthemed-neutral-500 underline decoration-solid"
          href="/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-color-unthemed-neutral-600 hover:text-color-unthemed-neutral-500 underline decoration-solid"
          href="/privacy"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
