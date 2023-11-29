import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const examples = await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Example")
      .selectAll()
      .execute();
    return examples;
  }),

  create: publicProcedure.input(z.object({ text: z.string() })).mutation(async ({ input }) => {
    const { insertId } = await dbfetch().insertInto("Example").values({ text: input.text }).executeTakeFirstOrThrow();

    return { insertId: Number(insertId) };
  }),
});
