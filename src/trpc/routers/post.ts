import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagsPostRouter = {
  info: (p: { postId: number }) => `post-info-${p.postId}`,
  myLatest10: (p: { userId: number }) => `post-myLatest10-${p.userId}`,
};

export const postRouter = createTRPCRouter({
  info: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("Post")
      .selectAll()
      .where("id", "=", input.postId)
      .getFirst({
        next: { tags: [tagsPostRouter.info({ postId: input.postId })] },
      });
  }),
  myLatest10: protectedProcedure.query(async ({ ctx }) => {
    return db
      .selectFrom("UserPostPivot")
      .where("userId", "=", ctx.user.id)
      .innerJoin("Post", "Post.id", "UserPostPivot.postId")
      .selectAll("Post")
      .orderBy("Post.id", "desc")
      .limit(10)
      .get({
        next: { tags: [tagsPostRouter.myLatest10({ userId: ctx.user.id })] },
      });
  }),
  create: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    const { insertId: postId } = await db
      .insertInto("Post")
      .values({
        text: input.text,
      })
      .postOrThrow();

    await db
      .insertInto("UserPostPivot")
      .values({
        postId: postId,
        userId: ctx.user.id,
      })
      .postOrThrow();

    revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
    return db.selectFrom("Post").selectAll().where("id", "=", postId).getFirstOrThrow({ cache: "no-store" });
  }),
  update: protectedProcedure
    .input(z.object({ postId: z.number(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db
        .updateTable("Post")
        .set({
          text: input.text,
        })
        .where("id", "=", input.postId)
        .postOrThrow();

      revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
      revalidateTag(tagsPostRouter.info({ postId: input.postId }));

      return db.selectFrom("Post").selectAll().where("id", "=", input.postId).getFirstOrThrow({
        cache: "no-store",
      });
    }),

  delete: protectedProcedure.input(z.object({ postId: z.number() })).mutation(async ({ input, ctx }) => {
    await db.deleteFrom("Post").where("id", "=", input.postId).postOrThrow();

    revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
    return true;
  }),
});
