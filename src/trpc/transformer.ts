/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { JSONE } from "#src/utils/jsone";
import type { CombinedDataTransformer } from "@trpc/server";

export const transformer: CombinedDataTransformer = {
  input: {
    serialize: (object) => JSONE.stringify(object),
    deserialize: (object) => JSONE.parse(object),
  },
  output: {
    serialize: (object) => JSONE.stringify(object),
    deserialize: (object) => JSONE.parse(object),
  },
};
