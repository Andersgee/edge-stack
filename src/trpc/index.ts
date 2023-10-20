import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
});

export type TrpcRouter = typeof trpcRouter;
