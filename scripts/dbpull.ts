import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes } from "./mysql8-introspect";
import { dbfetch } from "#src/db";
import { writeFileSync } from "fs";
import { join } from "path";

const db = dbfetch();

const cwd = process.cwd();
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");

async function main() {
  const info = await introspect(db);

  const prismastring = generatePrismaSchema(info);
  const typescriptstring = generateTypescriptTypes(info);

  writeFileSync(pulledPrismaPath, prismastring);
  writeFileSync(typescriptTypesPath, typescriptstring);

  console.log("saved introspected types.ts and pulled.prisma");
}

void main();
