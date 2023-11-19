import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    //await wait(2000);
    const examples = await db({ next: { revalidate: 10 } })
      .selectFrom("Example")
      .selectAll()
      .execute();
    return examples;
  }),

  create: publicProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    const { insertId } = await db().insertInto("Example").values({ text: input.text }).executeTakeFirstOrThrow();

    return { insertId: Number(insertId) };
  }),
});
