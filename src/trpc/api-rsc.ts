import { createServerSideHelpers } from "@trpc/react-query/server";
import { getUserFromCookie } from "#src/utils/jwt";
import { trpcRouter } from ".";
import { transformer } from "./transformer";
import { headers } from "next/headers";

//https://trpc.io/docs/client/nextjs/server-side-helpers#1-internal-router

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 *
 * makes route opt into dynamic rendering at request time.
 *
 * apiRscPublic instead if only calling publicProcedures
 *
 * ## Example
 *
 * ```ts
 * const { api, user } = await apiRsc();
 * const event = await api.post.getById.fetch({ postId });
 * ```
 *
 * relies on dynamic functions `cookies()` and `headers()`
 */
export const apiRsc = async () => {
  const user = await getUserFromCookie();

  return {
    api: createServerSideHelpers({
      transformer: transformer,
      router: trpcRouter,
      ctx: { user, resHeaders: null, reqHeaders: headers() },
    }),
    user,
  };
};

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 *
 * limited to publicProcedures
 *
 * should not make route opt into dynamic rendering at request time unlike apiRsc
 */
export const apiRscPublic = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: { user: null, resHeaders: null, reqHeaders: null },
});
