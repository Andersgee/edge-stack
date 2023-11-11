import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";
import { FetchDriver, type RequestInitLimited } from "./fetch-driver";
import { transformer } from "./transformer";

/**
 * default uses cache: "no-store"
 */
export const db = (init?: RequestInitLimited) =>
  new Kysely<DB>({
    dialect: {
      createAdapter: () => new MysqlAdapter(),
      createIntrospector: (db) => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
      createDriver: () =>
        new FetchDriver({
          transformer: transformer,
          url: process.env.DATABASE_HTTP_URL,
          init: {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
            },
            ...init,
          },
        }),
    },
  });

/*
export const db = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () =>
      new FetchDriver({
        transformer: transformer,
        url: process.env.DATABASE_HTTP_URL,
        init: {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
          },
        },
      }),
  },
});
*/
