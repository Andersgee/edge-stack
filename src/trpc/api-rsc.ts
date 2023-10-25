import { createServerSideHelpers } from "@trpc/react-query/server";
import { getUserFromCookie } from "#src/utils/jwt";
import { trpcRouter } from ".";
import { transformer } from "./transformer";

//https://trpc.io/docs/client/nextjs/server-side-helpers#1-internal-router

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 *
 * ## Example
 *
 * ```ts
 * const { api, user } = await apiRsc();
 * const event = await api.post.getById.fetch({ postId });
 * ```
 *
 * relies on `cookies()` from `"next/headers"` which makes route opt into dynamic rendering at request time.
 */
export const apiRsc = async () => {
  const user = await getUserFromCookie();

  return {
    api: createServerSideHelpers({
      transformer: transformer,
      router: trpcRouter,
      ctx: { user },
    }),
    user,
  };
};

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 *
 * only for public procedures
 */
export const apiRscPublic = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: { user: null },
});
