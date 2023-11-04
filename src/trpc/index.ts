import { postRouter } from "./routers/post";
import { stuffRouter } from "./routers/stuff";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  stuff: stuffRouter,
});

export type TrpcRouter = typeof trpcRouter;
