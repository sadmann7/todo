import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { todoRouter } from "./todo";

export const appRouter = router({
  auth: authRouter,
  example: exampleRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
