import { router } from "../trpc";
import { authRouter } from "./auth";
import { todoRouter } from "./todo";

export const appRouter = router({
  auth: authRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
