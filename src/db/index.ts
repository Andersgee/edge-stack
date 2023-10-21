/* eslint-disable @typescript-eslint/no-unused-vars */

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
// also use these result types instead of "SimplifySingleResult<O>" because getting insertId etc as bigint instead of number is annoying

type InsertResult = {
  insertId: number;
  numInsertedRows: number;
};

type DeleteResult = {
  numDeletedRows: number;
};

type UpdateResult = {
  numUpdatedRows: number;
};

declare module "kysely" {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    get(init?: RequestInitLimited): Promise<Simplify<O>[]>;
    getFirst(init?: RequestInitLimited): Promise<Simplify<O> | null>;
    getFirstOrThrow(init?: RequestInitLimited): Promise<Simplify<O>>;
  }

  interface UpdateQueryBuilder<DB, UT extends keyof DB, TB extends keyof DB, O> {
    post(): Promise<UpdateResult | null>;
    postOrThrow(): Promise<UpdateResult>;
  }

  interface DeleteQueryBuilder<DB, TB extends keyof DB, O> {
    post(): Promise<DeleteResult | null>;
    postOrThrow(): Promise<DeleteResult>;
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
UpdateQueryBuilder.prototype.post = async function <O>(): Promise<UpdateResult | null> {
  const result = (await executeWithFetchPost(this.compile())) as {
    numUpdatedOrDeletedRows: bigint | undefined;
  };
  //console.log("UpdateQueryBuilder, result:", result);

  if (!result) return null;

  return {
    numUpdatedRows: result.numUpdatedOrDeletedRows === undefined ? 0 : Number(result.numUpdatedOrDeletedRows),
  };
};

UpdateQueryBuilder.prototype.postOrThrow = async function <O>(): Promise<UpdateResult> {
  const result = await this.post();
  if (!result || result.numUpdatedRows <= 0) {
    throw new Error("no result");
  }
  return result;
};

//delete
DeleteQueryBuilder.prototype.post = async function <O>(): Promise<DeleteResult | null> {
  const result = (await executeWithFetchPost(this.compile())) as {
    numUpdatedOrDeletedRows: bigint | undefined;
  };

  if (!result) return null;

  return {
    numDeletedRows: result.numUpdatedOrDeletedRows === undefined ? 0 : Number(result.numUpdatedOrDeletedRows),
  };
};

DeleteQueryBuilder.prototype.postOrThrow = async function <O>(): Promise<DeleteResult> {
  const result = await this.post();
  if (!result || result.numDeletedRows <= 0) {
    throw new Error("no result");
  }
  return result;
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

  if (!result || result.numInsertedRows <= 0) {
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
