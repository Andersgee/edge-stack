import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";

export const tagsPostRouter = {
  getById: (p: { postId: number }) => `post-info-${p.postId}`,
  myLatest10: (p: { userId: number }) => `post-myLatest10-${p.userId}`,
};

function postInfoQuery(postId: number) {
  return db
    .selectFrom("Post")
    .where("id", "=", postId)
    .select((eb) => [
      "Post.id",
      "Post.text",
      "Post.createdAt",
      jsonArrayFrom(
        eb
          .selectFrom("UserPostPivot")
          .select("UserPostPivot.userId")
          .whereRef("UserPostPivot.postId", "=", "Post.id")
          .innerJoin("User", "User.id", "UserPostPivot.userId")
          .select(["User.name", "User.image"])
      ).as("editors"),
    ]);
}

async function getByIdFromCache(postId: number) {
  return postInfoQuery(postId).getFirst({
    next: { tags: [tagsPostRouter.getById({ postId: postId })] },
  });
}

async function getByIdFresh(postId: number) {
  return postInfoQuery(postId).getFirst({
    cache: "no-store",
  });
}

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return getByIdFromCache(input.postId);
  }),
  latest10whereImEditor: protectedProcedure.query(async ({ ctx }) => {
    const pivots = await db
      .selectFrom("UserPostPivot")
      .where("userId", "=", ctx.user.id)
      .innerJoin("Post", "Post.id", "UserPostPivot.postId")
      .select("Post.id as postId")
      .orderBy("Post.id", "desc")
      .limit(10)
      .get({
        cache: "no-store",
      });

    const posts = await Promise.all(pivots.map(({ postId }) => getByIdFromCache(postId)));

    return posts;
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
    revalidateTag(tagsPostRouter.getById({ postId }));
    return getByIdFromCache(postId);
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
      revalidateTag(tagsPostRouter.getById({ postId: input.postId }));

      return getByIdFresh(input.postId);
    }),

  delete: protectedProcedure.input(z.object({ postId: z.number() })).mutation(async ({ input, ctx }) => {
    await db.deleteFrom("Post").where("id", "=", input.postId).postOrThrow();

    revalidateTag(tagsPostRouter.myLatest10({ userId: ctx.user.id }));
    revalidateTag(tagsPostRouter.getById({ postId: input.postId }));
    return true;
  }),
});
