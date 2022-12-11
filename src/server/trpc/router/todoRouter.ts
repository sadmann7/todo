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

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return prisma.todo.delete({
        where: {
          id,
        },
      });
    }),

  toggleTodo: protectedProcedure
    .input(z.object({ id: z.string(), checked: z.boolean() }))
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { id, checked } = input;

      return prisma.todo.update({
        where: {
          id,
        },
        data: {
          checked,
        },
      });
    }),

  getAllTodos: protectedProcedure.query(({ ctx }) => {
    const { prisma } = ctx;
    return prisma.todo.findMany();
  }),
});
