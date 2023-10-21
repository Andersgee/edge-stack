"use client";

import { prettyDate, prettyDateShort } from "#src/utils/date";
import { useEffect, useState } from "react";

type Props = {
  date: Date;
};

/** without hydration mismatch, by editing string on mount */
export function PrettyDateShortString({ date }: Props) {
  const [str, setStr] = useState(() => prettyDateShort(date, false));
  useEffect(() => {
    setStr(prettyDateShort(date, true));
  }, [date]);

  return str;
}

/** without hydration mismatch, by editing string on mount */
export function PrettyDateString({ date }: Props) {
  const [str, setStr] = useState(() => prettyDate(date, false));
  useEffect(() => {
    setStr(prettyDate(date, true));
  }, [date]);

  return str;
}
