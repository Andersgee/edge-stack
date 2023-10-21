/** example: `"Wednesday, July 5, 2023 at 13:17"` */
export function prettyDate(date: Date, defaultLocale = true) {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  //undefined locale to use browsers default locale
  if (defaultLocale) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short", hour12: false }).format(date);
  } else {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      hour12: false,
      timeZone: "UTC",
      //timeZoneName: "short", //print timezone
    }).format(date);
  }
}

/** example: `"Jul 5, 2023, 13:17"` */
export function prettyDateShort(date: Date, defaultLocale = true) {
  if (defaultLocale) {
    //undefined to use browsers default locale
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", hour12: false }).format(date);
  } else {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone: "UTC",
    }).format(date);
  }
}
