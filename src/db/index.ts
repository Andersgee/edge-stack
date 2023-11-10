import { kysely } from "./kysely";
import { db } from "./fetch-driver";

async function exampleSelect() {
  const q = kysely.selectFrom("Post").selectAll();
  const correct = await q.execute();
  const withGet = await db.get(q, { next: { revalidate: 10 } });
  const withPost = await db.post(q);
}

async function exampleInsert() {
  const q = kysely.insertInto("Post").values({ text: "lala", userId: 1 });

  const correct = await q.executeTakeFirstOrThrow();
  const withGet = await db.getTakeFirstOrThrow(q, { next: { revalidate: 10 } });
  const withPost = await db.postTakeFirstOrThrow(q);
}

async function exampleDelete() {
  const q = kysely.deleteFrom("Post").where("id", "=", 1);

  const correct = await q.executeTakeFirstOrThrow();
  const withGet = await db.getTakeFirstOrThrow(q, { next: { revalidate: 10 } });
  const withPost = await db.postTakeFirstOrThrow(q);
}

async function exampleUpdate() {
  const q = kysely.updateTable("Post").where("id", "=", 1);

  const correct = await q.executeTakeFirstOrThrow();
  const withGet = await db.getTakeFirstOrThrow(q, { next: { revalidate: 10 } });
  const withPost = await db.postTakeFirstOrThrow(q);
}
