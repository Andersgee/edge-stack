import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";
import { FetchDriver, type RequestInitLimited } from "./fetch-driver";
import { transformer } from "./transformer";

/**
 * this is just regular `fetch()` under the hood.
 *
 * ## vanilla usage
 * ```ts
 * //defaults to cache: "no-store" so this does not interact with nextjs http-cache at all.
 * const { insertId } = await db()
 *   .insertInto("Post")
 *   .values({ text: "hello", userId: 1 })
 *   .executeTakeFirstOrThrow();
 *
 * const posts = await db()
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id","desc")
 *   .limit(10)
 *   .execute();
 * ```
 * ## advanced usage
 * ```ts
 * //with tag:
 * //always instantly respond with cached data (except the very first time)
 * //never update cache until revalidateTag("latest-10-posts") is called somewhere
 * const posts = await db({ next: { tags: ["latest-10-posts"] } })
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id", "desc")
 *   .limit(10)
 *   .execute();
 *
 * //with revalidate:
 * //always instantly respond with cached data (except the very first time)
 * //if more than x seconds has passed since added to cache then also fetch fresh data and update cache
 * const posts = await db({ next: { revalidate: 10 } })
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id", "desc")
 *   .limit(10)
 *   .execute();
 * ```
 */
export const db = (init?: RequestInitLimited) =>
  new Kysely<DB>({
    dialect: {
      createAdapter: () => new MysqlAdapter(),
      createIntrospector: (db) => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
      createDriver: () => {
        //default to "force-cache" if using next.tags
        let cache: RequestInitLimited["cache"] = init?.next?.tags !== undefined ? "force-cache" : "no-store";

        if (init?.next?.revalidate !== undefined) {
          //also, default to undefined if using next.revalidate (this is what nextjs wants)
          cache = undefined;
        }

        return new FetchDriver({
          transformer: transformer,
          url: process.env.DATABASE_HTTP_URL,
          init: {
            method: "GET",
            cache: cache,
            headers: {
              Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
            },
            ...init,
          },
        });
      },
    },
  });
