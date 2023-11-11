import { parse, stringify } from "devalue";

export const transformer = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize: (value: any) => stringify(value),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  deserialize: (str: string) => parse(str),
};
