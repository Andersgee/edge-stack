import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes } from "./mysql8-introspect";
import { dbfetch, dbTransaction } from "#src/db";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prismadiff } from "./utils/prisma-diff";
import { extradiff } from "./utils/extra-diff";
import { sleep } from "#src/utils/sleep";

/*
I like having schema.prisma as source of truth, but without prisma client as driver.

main idea is to:
1. introspect, save pulled.prisma
2. generate sql (compare schema.prisma - pulled.prisma with "prisma diff")
3. apply sql
4. introspect again and generate typescript types

but there are some caveats: prisma diff does not care about certain things like @updatedAt 
since they want to handle that in prisma client rather than on database level

there are additional caveats apparently where you cant quite trust
the information_schema queries actually have up to date info...
not sure how to solve

select * from information_schema.COLUMNS where TABLE_SCHEMA = database() and TABLE_NAME = `Example`


*/

const db = dbfetch();

const cwd = process.cwd();
const schemaPrismaPath = join(cwd, "prisma", "schema.prisma");
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");

async function main() {
  const introspectresult = await introspect(db);
  await writeFile(pulledPrismaPath, generatePrismaSchema(introspectresult));
  const prismadiffsql = prismadiff(pulledPrismaPath, schemaPrismaPath);
  console.log("applying prismadiffsql");
  await apply(prismadiffsql);

  //there might be extradiff
  //but introspectresult is stale after applying
  const introspectresult2 = await introspect(db);
  const extradiffsql = extradiff(introspectresult2, schemaPrismaPath);
  console.log("applying extradiffsql");
  await apply(extradiffsql);

  //await validateAndSave();

  await writeFile(typescriptTypesPath, generateTypescriptTypes(introspectresult2));
  console.log(`saved ${typescriptTypesPath}`);

  console.log("Done.");
}

async function validateAndSave() {
  console.log("validating...");
  const introspectresult = await introspect(db);
  await writeFile(pulledPrismaPath, generatePrismaSchema(introspectresult));
  console.log(`saved final ${pulledPrismaPath}`);
  const prismadiffsql = prismadiff(pulledPrismaPath, schemaPrismaPath);
  const extradiffsql = extradiff(introspectresult, schemaPrismaPath);

  if (prismadiffsql.length === 0 && extradiffsql.length === 0) {
    console.log("...validation ok");
  }
  if (prismadiffsql.length > 0) {
    console.log("...validation warning, found unexpected prismadiffsql:", prismadiffsql);
  }
  if (extradiffsql.length > 0) {
    console.log("...validation warning, found unexpected extradiffsql:", extradiffsql);
  }
  await writeFile(typescriptTypesPath, generateTypescriptTypes(introspectresult));
  console.log(`saved final ${typescriptTypesPath}`);
}

async function apply(sqls: string[]) {
  if (sqls.length === 0) {
    console.log("applying sql:", sqls, "(empty, skipping)");
    return;
  }
  console.log("applying sql:", sqls);
  const compiledQuerys = sqls.map((s) => ({ sql: s, parameters: [] }));
  const transactionresults = await dbTransaction(compiledQuerys);
  console.log("transactionresults:", transactionresults);
  //await breather();
}

async function breather() {
  const ms = 10000;
  console.log(`sleeping ${ms}ms... cuz informationschema does not update instantly?..`);
  await sleep(ms);
}

void main();
