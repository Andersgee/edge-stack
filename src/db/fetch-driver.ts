import { parse, stringify } from "devalue";
import type { Compilable, Simplify } from "kysely";
import { type SimplifyResult } from "node_modules/kysely/dist/esm/util/type-utils";

//only "force-cache", "no-store" or undefined compatible with nextjs http cache,
//so limit to not accidentally autocomplete unsupported "no-cache" or "reload" etc
type RequestInitLimited = Omit<RequestInit, "cache"> & {
  cache?: "force-cache" | "no-store";
};

/** for SELECT queries */
async function get<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O>[]> {
  const compiledQuery = c.compile();
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

/** for UPDATE, DELETE, INSERT queries */
async function post<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O>[]> {
  const compiledQuery = c.compile();
  const q = stringify({
    sql: compiledQuery.sql,
    parameters: compiledQuery.parameters,
  });
  const url = `${process.env.DATABASE_HTTP_URL}?q=${q}`;
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store", //default to no-store for "post"
    headers: {
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    ...init,
  });

  if (res.ok) {
    try {
      const result = parse(await res.text());
      return result;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

async function postTakeFirst<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O> | null> {
  const [result] = await post(c, init);
  return result ?? null;
}
async function postTakeFirstOrThrow<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O>> {
  const result = await postTakeFirst(c, init);
  if (!result) throw new Error("no result");
  return result;
}

async function getTakeFirst<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O> | null> {
  const [row] = await get(c, init);
  return row ?? null;
}

async function getTakeFirstOrThrow<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O>> {
  const row = await getTakeFirst(c, init);
  if (!row) throw new Error("no result");
  return row;
}

export const db = {
  get,
  getTakeFirst,
  getTakeFirstOrThrow,
  post,
  postTakeFirst,
  postTakeFirstOrThrow,
};
