import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  addTodo: protectedProcedure
    .input(z.object({ label: z.string() }))
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { label } = input;

      const userId = session.user.id;
      return prisma.todo.create({
        data: {
          label,
          creator: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  getAllTodos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
