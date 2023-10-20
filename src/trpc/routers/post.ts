import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagsPostRouter = {
  info: (p: { postId: number }) => `post-info-${p.postId}`,
  latest10: () => `post-latest10`,
  myLatest10: (p: { userId: number }) => `post-myLatest10-${p.userId}`,
};

export const postRouter = createTRPCRouter({
  info: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("Post")
      .selectAll()
      .where("id", "=", input.postId)
      .getFirst({
        next: { tags: [tagsPostRouter.info(input)] },
      });
  }),
  myLatest10: protectedProcedure.query(async ({ ctx }) => {
    return db
      .selectFrom("UserPostPivot")
      .where("userId", "=", ctx.user.id)
      .innerJoin("Post", "Post.id", "UserPostPivot.postId")
      .selectAll()
      .orderBy("Post.id", "desc")
      .limit(10)
      .get({
        next: { tags: [tagsPostRouter.myLatest10({ userId: ctx.user.id })] },
      });
  }),

  latest10: publicProcedure.query(async () => {
    return db
      .selectFrom("Post")
      .selectAll()
      .orderBy("id", "desc")
      .limit(10)
      .get({
        next: { tags: [tagsPostRouter.latest10()] },
      });
  }),
  create: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    const { insertId: postId } = await db
      .insertInto("Post")
      .values({
        text: input.text,
      })
      .postOrThrow();

    console.log("api.post, inserted postId:", postId);

    await db
      .insertInto("UserPostPivot")
      .values({
        postId: postId,
        userId: ctx.user.id,
      })
      .postOrThrow();

    revalidateTag(tagsPostRouter.latest10());
    revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
    return postId;
  }),
  delete: protectedProcedure.input(z.object({ postId: z.number() })).mutation(async ({ input, ctx }) => {
    const stuff = await db.deleteFrom("Post").where("id", "=", input.postId).postOrThrow();

    console.log("api.post.remove, stuff:", stuff);

    revalidateTag(tagsPostRouter.latest10());
    revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
    return true;
  }),
});
