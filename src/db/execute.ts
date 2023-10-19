import { parse, stringify } from "devalue";
import type { CompiledQuery } from "kysely";

/**
 * limit to not accidentally use stuff like "reload" or "only-if-cached", "no-cache" etc
 */
export type RequestInitLimited = RequestInit & {
  cache?: "force-cache" | "no-store";
};

export async function executeWithFetchGet(
  compiledQuery: CompiledQuery,
  init?: RequestInit
) {
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
    cache: "force-cache",
    ...init,
  });

  if (res.ok) {
    try {
      const result = parse(await res.text()) as any;
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
    cache: "no-store",
    headers: {
      "Content-Type": "text/plain",
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    body: stringify(body),
  });

  if (res.ok) {
    try {
      const result = parse(await res.text()) as any;
      return result.rows;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}
