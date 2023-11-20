import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    //eslint errors on this...

    const examples = await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Example")
      .selectAll()
      .execute();

    //but not on this...
    //const d = dbfetch({ next: { revalidate: 10 } });
    //const examples = await d.selectFrom("Example").selectAll().execute();
    return examples;
  }),

  create: publicProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    const { insertId } = await dbfetch().insertInto("Example").values({ text: input.text }).executeTakeFirstOrThrow();

    return { insertId: Number(insertId) };
  }),
});
