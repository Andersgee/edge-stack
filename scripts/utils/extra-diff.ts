import { readFileSync } from "fs";
import type { IntrospectResult } from "scripts/mysql8-introspect";

type Item = { tableName: string; colName: string };

/** a list of sql related to "@updatedAt" usage */
export function extradiff(prismaSchemaPath: string, r: IntrospectResult) {
  const db_atupdatedAt: Item[] = [];
  for (const [tn, cols] of Object.entries(r.tableTypes)) {
    for (const col of cols) {
      if (col.EXTRA.startsWith("DEFAULT_GENERATED on update CURRENT_TIMESTAMP")) {
        db_atupdatedAt.push({ tableName: tn, colName: col.COLUMN_NAME });
      }
    }
  }
  const schema_atupdatedAt = schema_updatedat_usage(prismaSchemaPath);

  const needs_adding = schema_atupdatedAt.filter(
    (a) => !db_atupdatedAt.some((b) => b.tableName === a.tableName && b.colName === a.colName)
  );
  const needs_removal = db_atupdatedAt.filter(
    (a) => !schema_atupdatedAt.some((b) => b.tableName === a.tableName && b.colName === a.colName)
  );

  const addsqls = needs_adding.map((x) => add_updatedat_sql(x, r));
  const removesqls = needs_removal.map((x) => remove_updatedat_sql(x, r));
  return addsqls.concat(removesqls).filter(Boolean);
}

/**
 * just look at lines and grab tableName and colName of wherever "@updatedAt" appears.
 * If more of these things come up might be worth properly parsing entire file.
 */
function schema_updatedat_usage(schemaPrismaPath: string) {
  const relevant: Item[] = [];
  const content = readFileSync(schemaPrismaPath, "utf8");
  let currentModel = "";
  for (const str of content.split("\n")) {
    const line = str.trim().split("//")[0]!;
    const words = split_whitespace(line);
    if (words[0] === "model" && words[2]?.startsWith("{")) {
      currentModel = words[1]!;
    }
    if (words.join("").includes("@updatedAt")) {
      relevant.push({ tableName: currentModel, colName: words[0]! });
    }
  }
  return relevant;
}

function add_updatedat_sql(x: Item, r: IntrospectResult) {
  const info = r.tableTypes[x.tableName]?.find((a) => a.COLUMN_NAME === x.colName);
  if (!info) {
    return "";
  }
  if (!info.COLUMN_DEFAULT || !info.COLUMN_DEFAULT.startsWith("CURRENT_TIMESTAMP")) {
    console.log(
      `using @updatedAt requires that you also use @default(now()). which sets some CURRENT_TIMESTAMP variant, but COLUMN_DEFAULT is currently: '${info.COLUMN_DEFAULT}' for ${info.TABLE_NAME}.${info.COLUMN_NAME}`
    );
    return "";
  }
  const sql = `ALTER TABLE \`${info.TABLE_NAME}\` MODIFY \`${info.COLUMN_NAME}\` ${info.COLUMN_TYPE} NOT NULL DEFAULT ${info.COLUMN_DEFAULT} ON UPDATE ${info.COLUMN_DEFAULT}`;
  return sql;
}

function remove_updatedat_sql(x: Item, r: IntrospectResult) {
  const info = r.tableTypes[x.tableName]?.find((a) => a.COLUMN_NAME === x.colName);
  if (!info) {
    return "";
  }

  const sql = `ALTER TABLE \`${info.TABLE_NAME}\` MODIFY \`${info.COLUMN_NAME}\` ${info.COLUMN_TYPE} ${
    info.IS_NULLABLE === "YES" ? "NULL" : "NOT NULL"
  } ${info.COLUMN_DEFAULT ? `DEFAULT ${info.COLUMN_DEFAULT}` : ""}`;

  return sql;
}

function split_whitespace(s: string) {
  return s.split(/(\s+)/).filter((x) => x.trim().length > 0);
}
