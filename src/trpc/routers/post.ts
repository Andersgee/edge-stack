import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { wait } from "#src/utils/wait";
import { revalidateTag } from "next/cache";

async function maybeDebugThrow() {
  const DEBUG_ERROR_MS = 2000;
  const DEBUG_ERROR_FRACTION = 0.5;

  if (Math.random() < DEBUG_ERROR_FRACTION) {
    await wait(DEBUG_ERROR_MS);
    throw "debug throw here";
  }
}

export const postRouter = createTRPCRouter({
  latest: protectedProcedure.query(async ({ ctx }) => {
    //await wait(2000);

    const posts = db({ next: { revalidate: 10 } })
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .orderBy("id", "desc")
      .limit(10)
      .execute();

    return posts;
  }),

  mylatest: protectedProcedure.query(async ({ ctx }) => {
    //await wait(2000);

    const posts = db({ next: { revalidate: 10 } })
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .where("userId", "=", ctx.user.id)
      .orderBy("id", "desc")
      .limit(10)
      .execute();

    return posts;
  }),
  getById: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return await db().selectFrom("Post").selectAll().where("id", "=", input.postId).executeTakeFirst();
  }),
  create: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    //await maybeDebugThrow()
    const d = db();

    const { insertId: postId } = await d
      .insertInto("Post")
      .values({
        text: input.text,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    const newPost = d
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .where("Post.id", "=", Number(postId))
      .executeTakeFirst();

    //const newPost = await db().selectFrom("Post").selectAll().where("id", "=", Number(postId)).executeTakeFirst();
    return newPost ?? null;
  }),
  update: protectedProcedure
    .input(z.object({ postId: z.number(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      //await maybeDebugThrow()
      const d = db();

      await d
        .updateTable("Post")
        .where("id", "=", input.postId)
        .where("userId", "=", ctx.user.id)
        .set({
          text: input.text,
        })
        .executeTakeFirstOrThrow();

      const updatedPost = d
        .selectFrom("Post")
        .innerJoin("User", "User.id", "Post.userId")
        .selectAll("Post")
        .select(["User.image as userImage", "User.name as userName"])
        .where("Post.id", "=", Number(input.postId))
        .executeTakeFirst();

      return updatedPost ?? null;
    }),

  delete: protectedProcedure.input(z.object({ postId: z.number() })).mutation(async ({ input, ctx }) => {
    //await maybeDebugThrow()

    const deleteResult = await db()
      .deleteFrom("Post")
      .where("id", "=", input.postId)
      .where("userId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    return deleteResult.numDeletedRows > 0;
  }),

  infinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      await wait(1000);
      const limit = 5;

      let query = db()
        .selectFrom("Post")
        .selectAll()
        .orderBy("id", "desc")
        .limit(limit + 1); //one extra to know first item of next page

      if (input.cursor !== undefined) {
        query = query.where("id", "<=", input.cursor);
      }

      const items = await query.execute();

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const firstItemOfNextPage = items.pop()!; //dont return the one extra
        nextCursor = firstItemOfNextPage.id;
      }
      return { items, nextCursor };
    }),
});
