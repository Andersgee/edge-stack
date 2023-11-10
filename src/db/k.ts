import type { Compilable, CompiledQuery, QueryResult, Simplify } from "kysely";
import type { SelectQueryBuilder, UpdateQueryBuilder, DeleteQueryBuilder, InsertQueryBuilder } from "kysely";
import { kysely } from "./kysely";
import { parse, stringify } from "devalue";
import type { SimplifyResult } from "node_modules/kysely/dist/esm/util/type-utils";
import { DB } from "./types";

//async function bek(c:Compilable<unknown>) {
//    const compiled = c.compile()
//}

const db = {
  get,
  getTakeFirst: getTakeFirst,
  getTakeFirstOrThrow: getTakeFirstOrThrow,
  post,
  postTakeFirst,
  postTakeFirstOrThrow,
};

//only "force-cache", "no-store" or undefined compatible with nextjs http cache,
//so limit to not accidentally autocomplete unsupported "no-cache" or "reload" etc
type RequestInitLimited = Omit<RequestInit, "cache"> & {
  cache?: "force-cache" | "no-store";
};

async function get<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<SimplifyResult<O>[]> {
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
      const result = parse(await res.text()) as QueryResult<O>;
      return result.rows as SimplifyResult<O>[];
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

async function getTakeFirst<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<SimplifyResult<O> | null> {
  const [row] = await get(c, init);
  return row ?? null;
}

async function getTakeFirstOrThrow<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<SimplifyResult<O>> {
  const row = await getTakeFirst(c, init);
  if (!row) {
    throw new Error("no result");
  }

  return row;
}

async function post<O>(c: Compilable<O>): Promise<SimplifyResult<O>[]> {
  const compiledQuery = c.compile();
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
      const result = parse(await res.text());
      return result;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

async function postTakeFirst<O>(c: Compilable<O>): Promise<SimplifyResult<O> | null> {
  const [row] = await post(c);
  return row ?? null;
}

async function postTakeFirstOrThrow<O>(c: Compilable<O>): Promise<SimplifyResult<O>> {
  const row = await postTakeFirst(c);
  if (!row) {
    throw new Error("no result");
  }
  return row;
}

/** same as postTakeFirst but number instead of bigint, and null if  */
/*
async function insertTakeFirst<O>(
  c: Compilable<O>
): Promise<{ insertId: number; numInsertedOrUpdatedRows: number } | null> {
  const insertResult = (await postTakeFirst(c)) as null | {
    insertId: bigint | undefined;
    numInsertedOrUpdatedRows: bigint | undefined;
  };
  if (!insertResult?.insertId === undefined || insertResult?.numInsertedOrUpdatedRows === undefined) return null;

  return {
    insertId: Number(insertResult.insertId),
    numInsertedOrUpdatedRows: Number(insertResult.numInsertedOrUpdatedRows),
  };
}
async function insertTakeFirstOrThrow<O>(c: Compilable<O>) {
  const insertResult = await insertTakeFirst(c);
  if (!insertResult) {
    throw new Error("no result");
  }
  return insertResult;
}
*/
async function selectFrom() {
  const q = kysely.selectFrom("Post").select("text").where("userId", "=", 1);

  const hmm = await q.executeTakeFirstOrThrow();

  const a = await db.get(q);

  const b = await db.getTakeFirst(q);

  const c = await db.getTakeFirstOrThrow(q);
}

async function insertInto() {
  const q = kysely.insertInto("Post").values({
    text: "ala",
    userId: 1,
  });

  const hmm = await q.executeTakeFirstOrThrow();
  hmm.insertId;
  hmm.numInsertedOrUpdatedRows;

  const a = await post(q);
  a[0]?.insertId;
  a[0]?.numInsertedOrUpdatedRows;

  const b = await postTakeFirst(q);
  b?.insertId;

  const c = await postTakeFirstOrThrow(q);
  c.insertId;
}

async function updateTable() {
  const q = kysely.updateTable("Post").where("id", "=", 1).set({
    text: "belk",
  });

  const hmm = await q.executeTakeFirstOrThrow();
  hmm.numUpdatedRows;
  hmm.numChangedRows;

  const a = await post(q);
  a[0]?.numUpdatedRows;
  a[0]?.numChangedRows;

  const b = await getTakeFirst(q);

  const c = await getTakeFirstOrThrow(q);
}

async function deleteFrom() {
  const q = kysely.deleteFrom("Post").where("id", "=", 1);

  const hmm = await q.executeTakeFirstOrThrow();
  hmm.numDeletedRows;

  const a = await post(q);
  a[0]?.numDeletedRows;

  const b = await getTakeFirst(q);

  const c = await getTakeFirstOrThrow(q);
}
