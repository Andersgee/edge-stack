import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";
import { FetchDriver, type RequestInitLimited } from "./fetch-driver";
import { transformer } from "./transformer";

/**
 * this is a query builder using regular `fetch()` under the hood.
 *
 * ## Example usage
 * ```ts
 * //without arguments
 * //always fetch and respond with fresh data
 * //defaults to cache: "no-store" so this does not interact with nextjs http-cache at all.
 * const { insertId } = await dbfetch()
 *   .insertInto("Post")
 *   .values({ text: "hello", userId: 1 })
 *   .executeTakeFirstOrThrow();
 *
 * const posts = await dbfetch()
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id","desc")
 *   .limit(10)
 *   .execute();
 *
 * //with tag:
 * //always instantly respond with cached data (except the very first time)
 * //never update cache until revalidateTag("latest-10-posts") is called somewhere
 * const posts = await dbfetch({ next: { tags: ["latest-10-posts"] } })
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id", "desc")
 *   .limit(10)
 *   .execute();
 *
 * //with revalidate:
 * //always instantly respond with cached data (except the very first time)
 * //if more than x seconds has passed since added to cache (when calling this) then also fetch fresh data and update cache for next call
 * const posts = await dbfetch({ next: { revalidate: 10 } })
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id", "desc")
 *   .limit(10)
 *   .execute();
 *
 * //once only
 * //always instantly respond with cached data (except the very first time)
 * //never update cache
 * await dbfetch({ cache: "force-cache" })
 *   .selectFrom("Post")
 *   .selectAll()
 *   .orderBy("id", "desc")
 *   .limit(10)
 *   .execute();
 * ```
 */
export function dbfetch(init?: RequestInitLimited) {
  return new Kysely<DB>({
    dialect: {
      createAdapter: () => new MysqlAdapter(),
      createIntrospector: (db) => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
      createDriver: () => {
        //default to no-store
        let cache: RequestInitLimited["cache"] = "no-store";
        if (init?.next?.tags !== undefined) {
          //default to "force-cache" if using next.tags
          cache = "force-cache";
        } else if (init?.next?.revalidate !== undefined) {
          //default to undefined if using next.revalidate (this is what nextjs wants)
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
}
