import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { wait } from "#src/utils/wait";

const DEBUG_ERROR_MS = 2000;
const DEBUG_ERROR_FRACTION = 0.5;

const TAGS = {
  initialInfinitePosts: "initialInfinitePosts",
};

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    return db.selectFrom("Post").selectAll().where("id", "=", input.postId).getFirst({
      cache: "no-store",
    });
  }),
  create: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    if (Math.random() < DEBUG_ERROR_FRACTION) {
      await wait(DEBUG_ERROR_MS);
      throw "debug throw here";
    }

    const { insertId: postId } = await db
      .insertInto("Post")
      .values({
        text: input.text,
        userId: ctx.user.id,
      })
      .postOrThrow();

    return db.selectFrom("Post").selectAll().where("id", "=", postId).getFirst({ cache: "no-store" });
  }),
  update: protectedProcedure
    .input(z.object({ postId: z.number(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (Math.random() < DEBUG_ERROR_FRACTION) {
        await wait(DEBUG_ERROR_MS);
        throw "debug throw here";
      }

      await db
        .updateTable("Post")
        .where("id", "=", input.postId)
        .set({
          text: input.text,
        })
        .postOrThrow();

      return db.selectFrom("Post").selectAll().where("id", "=", input.postId).getFirst({ cache: "no-store" });
    }),

  delete: protectedProcedure.input(z.object({ postId: z.number() })).mutation(async ({ input, ctx }) => {
    if (Math.random() < DEBUG_ERROR_FRACTION) {
      await wait(DEBUG_ERROR_MS);
      throw "debug throw here";
    }

    await db.deleteFrom("Post").where("userId", "=", ctx.user.id).where("id", "=", input.postId).postOrThrow();

    return true;
  }),

  infinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      //await wait(4000);
      //throw "debug throw here";

      const limit = 3;

      let query = db
        .selectFrom("Post")
        .selectAll()
        .orderBy("id", "desc")
        .limit(limit + 1); //one extra to know where next page starts

      if (input.cursor !== undefined) {
        query = query.where("id", "<", input.cursor);
      }

      const items = await query.get({ cache: "no-store" });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  initialInfinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      //await wait(4000);
      //throw "debug throw here";

      const limit = 3;

      let query = db
        .selectFrom("Post")
        .selectAll()
        .orderBy("id", "desc")
        .limit(limit + 1); //one extra to know where next page starts

      if (input.cursor !== undefined) {
        query = query.where("id", "<", input.cursor);
      }

      const items = await query.get({ cache: "no-store" });
      //const items = await query.get({ cache: "force-cache", next: { tags: [TAGS.initialInfinitePosts] } });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
