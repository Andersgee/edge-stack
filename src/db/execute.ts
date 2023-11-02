/* eslint-disable @typescript-eslint/no-unsafe-return */
import { parse, stringify } from "devalue";
import type { CompiledQuery } from "kysely";

/**
 * limit to not accidentally use stuff like "reload" or "only-if-cached", "no-cache" etc
 *
 * see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
 *
 * no-cache (get fresh AND update cache) would be very useful...
 * but in nextjs, "no-cache" behaves same as "no-store"
 *
 * also: require it to avoid cunfusion because in nextjs, if using something like cookies() elsewhere
 * then the default changes to "no-store" instead of "force-cache"
 * I prefer the default not change depending on some random usage of other functions.
 *
 * also this is only for SELECT querys, hardcode default "no-store" for INSERT, UPDATE and DELETE querys.
 */
export type RequestInitLimited = RequestInit & {
  cache: "force-cache" | "no-store";
};

export async function executeWithFetchGet(compiledQuery: CompiledQuery, init?: RequestInitLimited) {
  const q = stringify({
    sql: compiledQuery.sql,
    parameters: compiledQuery.parameters,
  });
  const url = `${process.env.DATABASE_HTTP_URL}?q=${q}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    ...init,
  });

  if (res.ok) {
    try {
      const result = parse(await res.text());
      return result.rows;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

export async function executeWithFetchPost(compiledQuery: CompiledQuery) {
  const body = {
    sql: compiledQuery.sql,
    parameters: compiledQuery.parameters,
  };
  const url = process.env.DATABASE_HTTP_URL;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Authorization": process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    cache: "no-store",
    body: stringify(body),
  });

  if (res.ok) {
    try {
      const info = parse(await res.text());
      return info;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}
