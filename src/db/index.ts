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
import {
  type RequestInitLimited,
  executeWithFetchGet,
  executeWithFetchPost,
} from "./execute";

// this is a mysql dummy driver eg only for compiling querys but with
// get() getFirst() getFirstOrThrow() on select querys and
// post() postTakeFirst() postTakeFirstOrThrow() on other types of querys

declare module "kysely" {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    get(init?: RequestInitLimited): Promise<Simplify<O>[]>;
    getFirst(init?: RequestInitLimited): Promise<Simplify<O> | null>;
    getFirstOrThrow(init?: RequestInitLimited): Promise<Simplify<O>>;
  }

  interface UpdateQueryBuilder<
    DB,
    UT extends keyof DB,
    TB extends keyof DB,
    O
  > {
    post(): Promise<Simplify<O>[]>;
    postTakeFirst(): Promise<Simplify<O> | null>;
    postTakeFirstOrThrow(): Promise<Simplify<O>>;
  }

  interface DeleteQueryBuilder<DB, TB extends keyof DB, O> {
    post(): Promise<Simplify<O>[]>;
    postTakeFirst(): Promise<Simplify<O> | null>;
    postTakeFirstOrThrow(): Promise<Simplify<O>>;
  }

  interface InsertQueryBuilder<DB, TB extends keyof DB, O> {
    post(): Promise<Simplify<O>[]>;
    postTakeFirst(): Promise<Simplify<O> | null>;
    postTakeFirstOrThrow(): Promise<Simplify<O>>;
  }
}

//select
SelectQueryBuilder.prototype.get = async function <O>(
  init?: RequestInitLimited
): Promise<Simplify<O>[]> {
  return executeWithFetchGet(this.compile(), init);
};

SelectQueryBuilder.prototype.getFirst = async function <O>(
  init?: RequestInitLimited
): Promise<Simplify<O> | null> {
  const [result] = await this.get(init);
  return (result as Simplify<O>) ?? null;
};

SelectQueryBuilder.prototype.getFirstOrThrow = async function <O>(
  init?: RequestInitLimited
): Promise<Simplify<O>> {
  const [result] = await this.get(init);
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

//update
UpdateQueryBuilder.prototype.post = async function <O>(): Promise<
  Simplify<O>[]
> {
  return executeWithFetchPost(this.compile());
};

UpdateQueryBuilder.prototype.postTakeFirst = async function <
  O
>(): Promise<Simplify<O> | null> {
  const [result] = await this.post();
  return (result as Simplify<O>) ?? null;
};

UpdateQueryBuilder.prototype.postTakeFirstOrThrow = async function <
  O
>(): Promise<Simplify<O>> {
  const [result] = await this.post();
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

//delete
DeleteQueryBuilder.prototype.post = async function <O>(): Promise<
  Simplify<O>[]
> {
  return executeWithFetchPost(this.compile());
};

DeleteQueryBuilder.prototype.postTakeFirst = async function <
  O
>(): Promise<Simplify<O> | null> {
  const [result] = await this.post();
  return (result as Simplify<O>) ?? null;
};

DeleteQueryBuilder.prototype.postTakeFirstOrThrow = async function <
  O
>(): Promise<Simplify<O>> {
  const [result] = await this.post();
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

//insert
InsertQueryBuilder.prototype.post = async function <O>(): Promise<
  Simplify<O>[]
> {
  return executeWithFetchPost(this.compile());
};

InsertQueryBuilder.prototype.postTakeFirst = async function <
  O
>(): Promise<Simplify<O> | null> {
  const [result] = await this.post();
  return (result as Simplify<O>) ?? null;
};

InsertQueryBuilder.prototype.postTakeFirstOrThrow = async function <
  O
>(): Promise<Simplify<O>> {
  const [result] = await this.post();
  if (result === undefined) {
    throw new Error("no result");
  }
  return result as Simplify<O>;
};

export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () => new DummyDriver(),
  },
});
