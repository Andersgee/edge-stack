import { DummyDriver, Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";

//we use kysely as a query builder only. talk to api with regular fetch, this also avoids database driver dependencies

export const kysely = new Kysely<DB>({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
    createDriver: () => new DummyDriver(),
  },
});
