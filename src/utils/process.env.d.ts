import type { envSchema } from "../utils/validate-process-env.mjs";
import type { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
