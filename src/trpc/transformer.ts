/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { stringify, parse } from "#src/db/transformer";
import type { CombinedDataTransformer } from "@trpc/server";
//import { parse, stringify } from "devalue";
//
//export const transformer: CombinedDataTransformer = {
//  input: {
//    serialize: (object) => stringify(object),
//    deserialize: (object) => parse(object),
//  },
//  output: {
//    serialize: (object) => stringify(object),
//    deserialize: (object) => parse(object),
//  },
//};

export const transformer: CombinedDataTransformer = {
  input: {
    serialize: (object) => stringify(object),
    deserialize: (object) => parse(object),
  },
  output: {
    serialize: (object) => stringify(object),
    deserialize: (object) => parse(object),
  },
};
