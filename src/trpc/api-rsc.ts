import { createServerSideHelpers } from "@trpc/react-query/server";
import { getUserFromCookie } from "#src/utils/jwt";
import { trpcRouter } from ".";
import { transformer } from "./transformer";
import { headers } from "next/headers";
import type { Ctx } from "./trpc";

async function createTrpcContext(): Promise<Ctx> {
  const user = await getUserFromCookie();

  return {
    user,
    reqHeaders: headers(),
    resHeaders: null,
  };
}

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
  const ctx = await createTrpcContext();

  return {
    api: createServerSideHelpers({
      router: trpcRouter,
      ctx,
      transformer: transformer,
    }),
    user: ctx.user,
  };
};

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 *
 * for publicProcedures only
 *
 * should not make route opt into dynamic rendering at request time unlike apiRsc
 */
export const apiRscPublic = createServerSideHelpers({
  router: trpcRouter,
  ctx: { user: null, resHeaders: null, reqHeaders: null },
  transformer: transformer,
});
