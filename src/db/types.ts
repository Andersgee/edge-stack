import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Example = {
  id: Generated<number>;
  text: string;
};
export type Post = {
  id: Generated<number>;
  text: string;
  createdAt: Generated<Timestamp>;
  userId: number;
};
export type User = {
  id: Generated<number>;
  email: string;
  googleUserSub: string | null;
  discordUserId: string | null;
  githubUserId: number | null;
  image: string | null;
  name: string;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  Example: Example;
  Post: Post;
  User: User;
};
