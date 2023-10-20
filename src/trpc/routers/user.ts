import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagsUserRouter = {
  info: (p: { userId: number }) => `user-info-${p.userId}`,
};

export const userRouter = createTRPCRouter({
  info: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("User")
      .selectAll()
      .where("User.id", "=", input.userId)
      .getFirst({
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  infoPublic: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("User")
      .select(["id", "name", "image"])
      .where("User.id", "=", input.userId)
      .getFirst({
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  update: protectedProcedure.input(z.object({ name: z.string() })).query(async ({ input, ctx }) => {
    const updateResult = await db
      .updateTable("User")
      .where("id", "=", ctx.user.id)
      .set({
        name: input.name,
      })
      .post();

    if (Number(updateResult.numUpdatedRows)) {
      revalidateTag(tagsUserRouter.info({ userId: ctx.user.id }));
      return true;
    }
    return false;
  }),
});
