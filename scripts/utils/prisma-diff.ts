import { promisify } from "util";
import { exec as syncexec } from "child_process";

const exec = promisify(syncexec);

// pnpm prisma migrate diff --from-schema-datamodel prisma/pulled.prisma --to-schema-datamodel prisma/schema.prisma --script
// pnpm prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script

/** a list of sql according to "prisma migrate diff" */
export async function prismadiff(fromPath: string, toPath: string) {
  const cmd = `pnpm prisma migrate diff --from-schema-datamodel ${fromPath} --to-schema-datamodel ${toPath} --script`;
  const { stdout: diff_sql, stderr } = await exec(cmd);
  //console.log("prismadiff, diff_sql:", diff_sql);
  return sqllist(diff_sql);
}

function sqllist(diff_sql: string) {
  if (diff_sql.startsWith("-- This is an empty migration")) {
    return [];
  }
  return diff_sql.split("\n\n-- ").map((str) =>
    str
      .replaceAll("\n\n", "\n")
      .split("\n")
      .map((s) => s.trim())
      .filter((row, i) => i !== 0 && row !== "\n" && row !== "") //first row is a comment, also ignore empty rows
      .join(" ")
  );
}
