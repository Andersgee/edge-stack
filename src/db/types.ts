import type { Generated } from "kysely";
import type { GeoJSON } from "./geojson-types";
  
export type DB = {
  Example: Example;
  Post: Post;
  User: User;
};

export type Example = {
  /** default: autoincrement(), indexed: (id), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  id: Generated<number>;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  text: string;
};

export type Post = {
  /** default: autoincrement(), indexed: (id), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  id: Generated<number>;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  text: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
  /** indexed: (userId), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  userId: number;
  /** default: now(), dbtype: 'datetime(4)', eg "2000-12-24 21:01:59.123456" with max 4 digits after decimal */
  hmm: Generated<Date>;
};

export type User = {
  /** default: autoincrement(), indexed: (id), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  id: Generated<number>;
  /** indexed: (email), dbtype: 'varchar(191)', eg string with max 191 chars */
  email: string;
  /** indexed: (googleUserSub), dbtype: 'varchar(191)', eg string with max 191 chars */
  googleUserSub: string | null;
  /** indexed: (discordUserId), dbtype: 'varchar(191)', eg string with max 191 chars */
  discordUserId: string | null;
  /** indexed: (githubUserId), dbtype: 'int' eg number in range [-2_147_483_648, 2_147_483_647] */
  githubUserId: number | null;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  image: string | null;
  /** dbtype: 'varchar(191)', eg string with max 191 chars */
  name: string;
  /** default: now(), dbtype: 'datetime(3)', eg "2000-12-24 21:01:59.123456" with max 3 digits after decimal */
  createdAt: Generated<Date>;
};

