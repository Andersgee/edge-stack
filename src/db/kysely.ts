import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";
import { FetchDriver } from "./driver";
import { stringify, parse } from "devalue";

export const kysely = new Kysely<DB>({
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
