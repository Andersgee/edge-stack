import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { Compilable, DeleteResult, InsertResult, QueryResult, Simplify, UpdateResult } from "kysely";
import { UpdateQueryBuilder, InsertQueryBuilder, DeleteQueryBuilder } from "kysely";
import type { DB } from "./types";
import { FetchDriver } from "./driver";
import { stringify, parse } from "devalue";

type UpdateResultCasted = {
  numUpdatedRows: number;
  numChangedRows: number;
};

type InsertResultCasted = {
  numInsertedOrUpdatedRows: number;
  insertId: number;
};

type DeleteResultCasted = {
  numDeletedRows: number;
};

declare module "kysely" {
  interface UpdateQueryBuilder<DB, UT extends keyof DB, TB extends keyof DB, O> {
    /** for convenience, same as executeTakeFirstOrThrow but with number instead of bigint */
    executeTakeFirstOrThrowSimple(): Promise<UpdateResultCasted>;
  }
  interface InsertQueryBuilder<DB, TB extends keyof DB, O> {
    /** for convenience, same as executeTakeFirstOrThrow but with number instead of bigint */
    executeTakeFirstOrThrowSimple(): Promise<InsertResultCasted>;
  }
  interface DeleteQueryBuilder<DB, TB extends keyof DB, O> {
    /** for convenience, same as executeTakeFirstOrThrow but with number instead of bigint */
    executeTakeFirstOrThrowSimple(): Promise<DeleteResultCasted>;
  }
}

UpdateQueryBuilder.prototype.executeTakeFirstOrThrowSimple = async function () {
  const result = (await this.executeTakeFirstOrThrow()) as UpdateResult;
  return {
    numChangedRows: Number(result.numChangedRows ?? 0),
    numUpdatedRows: Number(result.numUpdatedRows),
  };
};
InsertQueryBuilder.prototype.executeTakeFirstOrThrowSimple = async function () {
  const result = (await this.executeTakeFirstOrThrow()) as InsertResult;
  return {
    numInsertedOrUpdatedRows: Number(result.numInsertedOrUpdatedRows ?? 0),
    insertId: Number(result.insertId),
  };
};
DeleteQueryBuilder.prototype.executeTakeFirstOrThrowSimple = async function () {
  const result = (await this.executeTakeFirstOrThrow()) as DeleteResult;
  return {
    numDeletedRows: Number(result.numDeletedRows),
  };
};

const kysely = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () =>
      new FetchDriver({
        url: process.env.DATABASE_HTTP_URL,
        authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
        transformer: {
          serialize: (value) => stringify(value),
          deserialize: (str) => parse(str),
        },
      }),
  },
});

//only "force-cache", "no-store" or undefined compatible with nextjs http cache,
//so limit to not accidentally autocomplete unsupported "no-cache" or "reload" etc
type RequestInitLimited = Omit<RequestInit, "cache"> & {
  cache?: "force-cache" | "no-store";
};

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
      const result = parse(await res.text()) as QueryResult<O>;
      return result.rows;
    } catch (error) {
      throw new Error("failed to parse response");
    }
  } else {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}

async function getFirst<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O> | null> {
  const [row] = await get(c, init);
  return row ?? null;
}

async function getFirstOrThrow<O>(c: Compilable<O>, init?: RequestInitLimited): Promise<Simplify<O>> {
  const row = await getFirst(c, init);
  if (!row) {
    throw new Error("no result");
  }

  return row;
}

export const db = {
  query: kysely,
  fetch: get,
  fetchFirst: getFirst,
  fetchFirstOrThrow: getFirstOrThrow,
};

async function hej() {
  const a = await db.query.updateTable("Post").where("id", "=", 1).executeTakeFirstOrThrow();
  a.numChangedRows;
  a.numUpdatedRows;

  const lgskdsgfd = db.query.updateTable("Post").where("id", "=", 1);
  const eururuwruew = db.fetch(lgskdsgfd);

  const x = await db.query.updateTable("Post").where("id", "=", 1).executeTakeFirstOrThrowSimple();

  const { numUpdatedRows, numChangedRows } = await db.query
    .updateTable("Post")
    .where("id", "=", 1)
    .executeTakeFirstOrThrow();

  const q = await db.query.deleteFrom("Post").where("id", "=", 1).executeTakeFirstOrThrow();

  const kek = db.query.selectFrom("Post").selectAll();

  const lelele = await db.fetch(kek, { cache: "force-cache", next: { revalidate: 10 } });
}
