import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes, type IntrospectResult } from "./mysql8-introspect";
import { dbfetch, dbTransaction } from "#src/db";
import { writeFileSync } from "fs";
import { join } from "path";
import { prismadiff } from "./utils/prisma-diff";
import { extradiff } from "./utils/extra-diff";

/*
I like having schema.prisma as source of truth, but without prisma client as driver.

main idea is to:
1. introspect, save pulled.prisma
2. generate sql (compare schema.prisma - pulled.prisma with "prisma diff")
3. apply sql
4. generate typescript types

but there are some caveats: prisma diff does not care about certain things like @updatedAt 
since they want to handle that in prisma client rather than on database level


actual steps:
1. get introspectresult and save pulled.prisma
2. generate prismadiffsql (compare schema.prisma - pulled.prisma with "prisma diff")
3. generate extradiffsql (compare introspectresult with schema.prisma)
4. if only extradiffsql, then apply it go to step 9. validate
5. apply prismadiffsql (this makes introspectresult stale)
6. get introspectresult (again)
7. generate extradiffsql (compare introspectresult with schema.prisma)
8. apply extradiffsql (if any)
9. validate
  perhaps get introspectresult (yet again) and save pulled.prisma
  generate prismadiffsql (compare schema.prisma - pulled.prisma with "prisma diff")
  generate extradiffsql (compare introspectresult with schema.prisma)
  check that indeed no diffs.
  generate typescript types
*/

const db = dbfetch();

const cwd = process.cwd();
const schemaPrismaPath = join(cwd, "prisma", "schema.prisma");
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");

async function main() {
  //1,2,3
  const introspectresult = await introspect(db);
  savePulledPrismaSchema(introspectresult);
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  const extradiffsql = extradiff(schemaPrismaPath, introspectresult);

  if (prismadiffsql.length === 0 && extradiffsql.length === 0) {
    console.log("No changes found.");
    console.log("Done.");
    return;
  }

  if (prismadiffsql.length === 0 && extradiffsql.length > 0) {
    console.log(`Only extradiff changes found.`);
    await apply(extradiffsql);
    await validate();
    console.log("Done.");
    return;
  }

  //ok. this is regular scenario
  //apply prismadiff first, then introspect again and potentially apply extradiff if any
  await apply(prismadiffsql);
  const introspectresult2 = await introspect(db);
  const extradiffsql2 = extradiff(schemaPrismaPath, introspectresult2);
  if (extradiffsql2.length > 0) {
    console.log("found extradiffsql2 (after applying prismadiffsql)");
    await apply(extradiffsql2);
  }

  await validate();
  console.log("Done.");
}

async function validate() {
  console.log("validating...");
  const introspectresult = await introspect(db);
  savePulledPrismaSchema(introspectresult);
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  const extradiffsql = extradiff(schemaPrismaPath, introspectresult);

  if (prismadiffsql.length === 0 && extradiffsql.length === 0) {
    console.log("...validation ok");
  }
  if (prismadiffsql.length > 0) {
    console.log("...validation warning, found unexpected prismadiffsql:", prismadiffsql);
  }
  if (extradiffsql.length > 0) {
    console.log("...validation warning, found unexpected extradiffsql:", extradiffsql);
  }
  //await saveTypescriptTypes(introspectresult);
}

function savePulledPrismaSchema(introspectresult: IntrospectResult) {
  const prismaschemastring = generatePrismaSchema(introspectresult);

  const path = pulledPrismaPath;
  writeFileSync(path, prismaschemastring, "utf8");
  console.log(`saved ${path}`);
}

function saveTypescriptTypes(introspectresult: IntrospectResult) {
  const typescriptstring = generateTypescriptTypes(introspectresult);

  const path = typescriptTypesPath;
  writeFileSync(path, typescriptstring, "utf8");
  console.log(`saved ${path}`);
}

async function apply(sqls: string[]) {
  console.log("applying sql:", sqls);
  const compiledQuerys = sqls.map((s) => ({ sql: s, parameters: [] }));
  const transactionresults = await dbTransaction(compiledQuerys);
  console.log("transactionresults:", transactionresults);
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
