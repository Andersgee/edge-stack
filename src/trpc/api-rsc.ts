import { getUserFromCookie } from "#src/utils/jwt";
import { trpcRouter } from ".";
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

/**
 * for server components (or server actions) calling protected (or public) procedures
 *
 * Will opt route into dynamic rendering since makes use of `next/headers` and
 *
 * ## Example usage
 *
 * ```ts
 * const { api, user } = await apiRsc();
 * const event = await api.post.getById({ postId });
 * ```
 * */
export const apiRsc = async () => {
  const ctx = await createTrpcContext();
  return {
    api: trpcRouter.createCaller(ctx),
    user: ctx.user,
  };
};

/**
 * for server components (or server actions) calling public procedures
 *
 * ## Example usage
 *
 * ```ts
 * const { api } = apiRscPublic();
 * const event = await api.post.getById({ postId });
 * ```
 * */
export const apiRscPublic = () => {
  const ctx: Ctx = { user: null, resHeaders: null, reqHeaders: null };
  return {
    api: trpcRouter.createCaller(ctx),
  };
};
