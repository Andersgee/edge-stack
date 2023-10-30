import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagsUserRouter = {
  info: (p: { userId: number }) => `user-info-${p.userId}`,
};

export const userRouter = createTRPCRouter({
  info: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return await db
      .selectFrom("User")
      .selectAll()
      .where("User.id", "=", input.userId)
      .getFirst({
        cache: "force-cache",
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  infoPublic: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return await db
      .selectFrom("User")
      .select(["id", "name", "image"])
      .where("User.id", "=", input.userId)
      .getFirst({
        cache: "force-cache",
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  update: protectedProcedure.input(z.object({ name: z.string() })).query(async ({ input, ctx }) => {
    await db
      .updateTable("User")
      .where("id", "=", ctx.user.id)
      .set({
        name: input.name,
      })
      .postOrThrow();

    revalidateTag(tagsUserRouter.info({ userId: ctx.user.id }));
    return true;
  }),
});
