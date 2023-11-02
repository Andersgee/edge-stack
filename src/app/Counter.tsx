"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Counter() {
  const pathname = usePathname();
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((prev) => prev + 1), 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    setSeconds(0);
  }, [pathname]);

  return <div className="">time on this path: {seconds}s</div>;
}
