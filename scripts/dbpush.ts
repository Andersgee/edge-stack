import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes, type IntrospectResult } from "./mysql8-introspect";
import { dbfetch, dbTransaction } from "#src/db";
import { writeFile } from "fs/promises";
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
  let introspectresult = await introspect(db);
  await savePulledPrismaSchema(introspectresult);
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  let extradiffsql = await extradiff(schemaPrismaPath, introspectresult);

  //4
  if (prismadiffsql.length === 0) {
    if (extradiffsql.length > 0) {
      introspectresult = await applyAndIntrospect(extradiffsql);
      await validateAndSaveTypes(introspectresult);
      console.log("Done.");
      return;
    } else {
      console.log("No changes found.");
      console.log("Done.");
      return;
    }
  }
  //5,6,7
  introspectresult = await applyAndIntrospect(prismadiffsql);
  extradiffsql = await extradiff(schemaPrismaPath, introspectresult);
  //8, 9
  if (extradiffsql.length > 0) {
    introspectresult = await applyAndIntrospect(extradiffsql);
    await validateAndSaveTypes(introspectresult);
    console.log("Done.");
    return;
  } else {
    await validateAndSaveTypes(introspectresult);
    console.log("Done.");
    return;
  }
}

async function applyAndIntrospect(sql: string[]) {
  await apply(sql);
  return await introspect(db);
}

async function validateAndSaveTypes(introspectresult: IntrospectResult) {
  await savePulledPrismaSchema(introspectresult);
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  const extradiffsql = await extradiff(schemaPrismaPath, introspectresult);

  if (prismadiffsql.length === 0 && extradiffsql.length === 0) {
    console.log("validated.");
  }
  if (prismadiffsql.length > 0) {
    console.log("on validate, found unexpected prismadiffsql:", prismadiffsql);
  }
  if (extradiffsql.length > 0) {
    console.log("on validate, found unexpected extradiffsql:", extradiffsql);
  }
  await saveTypescriptTypes(introspectresult);
}

async function savePulledPrismaSchema(introspectresult: IntrospectResult) {
  const path = pulledPrismaPath;
  const prismaschemastring = generatePrismaSchema(introspectresult);
  await writeFile(path, prismaschemastring);
  console.log(`saved ${path}`);
}

async function saveTypescriptTypes(introspectresult: IntrospectResult) {
  const path = typescriptTypesPath;
  const typescriptstring = generateTypescriptTypes(introspectresult);
  await writeFile(path, typescriptstring);
  console.log(`saved ${path}`);
}

async function apply(sqls: string[]) {
  console.log("applying sql:", sqls);
  const compiledQuerys = sqls.map((s) => ({ sql: s, parameters: [] }));
  await dbTransaction(compiledQuerys);
}

void main();
