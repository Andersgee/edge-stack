"use client";

import { useStore } from "#src/store";
import { useEffect } from "react";

export function Init() {
  const userGetSession = useStore.select.userGetSession();
  useEffect(() => {
    userGetSession()
      .then(() => void {})
      .catch(() => void {});
  }, [userGetSession]);
  return null;
}
