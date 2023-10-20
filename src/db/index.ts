/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Kysely,
  SelectQueryBuilder,
  UpdateQueryBuilder,
  DeleteQueryBuilder,
  InsertQueryBuilder,
  DummyDriver,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
  type Simplify,
} from "kysely";
import type { DB } from "./types";
import { type RequestInitLimited, executeWithFetchGet, executeWithFetchPost } from "./execute";

// this is a mysql dummy driver eg only for compiling querys but with
// get() getFirst() getFirstOrThrow() on select querys and
// post() postOrThrow() on other types of querys

type InsertResult = {
  insertId: number;
  numInsertedRows: number;
};

declare module "kysely" {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    get(init?: RequestInitLimited): Promise<Simplify<O>[]>;
    getFirst(init?: RequestInitLimited): Promise<Simplify<O> | null>;
    getFirstOrThrow(init?: RequestInitLimited): Promise<Simplify<O>>;
  }

  interface UpdateQueryBuilder<DB, UT extends keyof DB, TB extends keyof DB, O> {
    post(): Promise<Simplify<O>>;
    postOrThrow(): Promise<Simplify<O>>;
  }

  interface DeleteQueryBuilder<DB, TB extends keyof DB, O> {
    post(): Promise<Simplify<O>>;
    postOrThrow(): Promise<Simplify<O>>;
  }

  interface InsertQueryBuilder<DB, TB extends keyof DB, O> {
    post(): Promise<InsertResult | null>;
    postOrThrow(): Promise<InsertResult>;
  }
}

//select
SelectQueryBuilder.prototype.get = async function <O>(init?: RequestInitLimited): Promise<Simplify<O>[]> {
  return executeWithFetchGet(this.compile(), init);
};

SelectQueryBuilder.prototype.getFirst = async function <O>(init?: RequestInitLimited): Promise<Simplify<O> | null> {
  const [result] = await this.get(init);
  return (result as Simplify<O>) ?? null;
};

SelectQueryBuilder.prototype.getFirstOrThrow = async function <O>(init?: RequestInitLimited): Promise<Simplify<O>> {
  const [result] = await this.get(init);
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

//update
UpdateQueryBuilder.prototype.post = async function <O>(): Promise<Simplify<O>[]> {
  return executeWithFetchPost(this.compile());
};

UpdateQueryBuilder.prototype.postOrThrow = async function <O>(): Promise<Simplify<O>> {
  const result = await this.post();
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

//delete
DeleteQueryBuilder.prototype.post = async function <O>(): Promise<Simplify<O>[]> {
  return executeWithFetchPost(this.compile());
};

DeleteQueryBuilder.prototype.postOrThrow = async function <O>(): Promise<Simplify<O>> {
  const result = await this.post();
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as unknown as Simplify<O>;
};

//insert
InsertQueryBuilder.prototype.post = async function <O>(): Promise<InsertResult | null> {
  const result = (await executeWithFetchPost(this.compile())) as {
    insertId: bigint | undefined;
    numUpdatedOrDeletedRows: bigint | undefined;
  };

  if (!result) return null;

  return {
    insertId: result.insertId === undefined ? 0 : Number(result.insertId),
    numInsertedRows: Number(result.numUpdatedOrDeletedRows),
  };
};

InsertQueryBuilder.prototype.postOrThrow = async function <O>(): Promise<InsertResult> {
  const result = await this.post();

  if (!result) {
    throw new Error("no result");
  }
  return result;
};

export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () => new DummyDriver(),
  },
});
