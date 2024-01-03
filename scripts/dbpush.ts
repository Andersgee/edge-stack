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

but there are some caveats: prisma diff does not care about certain things like @updateat 
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
  get introspectresult (yet again) and save pulled.prisma
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
  //1
  let introspectresult = await introspect(db);
  savePulledPrismaSchema(introspectresult);
  //2
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  //3
  let extradiffsql = extradiff(schemaPrismaPath, introspectresult);
  //4
  if (prismadiffsql.length === 0) {
    if (extradiffsql.length > 0) {
      await apply(extradiffsql);
      await validateAndGenerateTypes();
      console.log("Done.");
      return;
    } else {
      console.log("No changes found.");
      console.log("Done.");
      return;
    }
  }
  //5
  await apply(prismadiffsql);
  //6
  introspectresult = await introspect(db);
  //7
  extradiffsql = extradiff(schemaPrismaPath, introspectresult);
  //8
  if (extradiffsql.length > 0) {
    await apply(extradiffsql);
  }
  //9
  await validateAndGenerateTypes();
  console.log("Done.");
}

async function validateAndGenerateTypes() {
  console.log("validating");
  const introspectresult = await introspect(db);
  savePulledPrismaSchema(introspectresult);
  const prismadiffsql = await prismadiff(pulledPrismaPath, schemaPrismaPath);
  const extradiffsql = extradiff(schemaPrismaPath, introspectresult);

  if (prismadiffsql.length > 0) {
    console.log("on validate, found unexpected prismadiffsql:", prismadiffsql);
  }
  if (extradiffsql.length > 0) {
    console.log("on validate, found unexpected extradiffsql:", extradiffsql);
  }

  saveTypescriptTypes(introspectresult);
}

function savePulledPrismaSchema(introspectresult: IntrospectResult) {
  const path = pulledPrismaPath;
  const prismaschemastring = generatePrismaSchema(introspectresult);
  writeFileSync(path, prismaschemastring);
  console.log(`saved ${path}`);
}

function saveTypescriptTypes(introspectresult: IntrospectResult) {
  const path = typescriptTypesPath;
  const typescriptstring = generateTypescriptTypes(introspectresult);
  writeFileSync(path, typescriptstring);
  console.log(`saved ${path}`);
}

async function apply(sqls: string[]) {
  console.log("applying sql:", sqls);
  const compiledQuerys = sqls.map((s) => ({ sql: s, parameters: [] }));
  await dbTransaction(compiledQuerys);
}

void main();
