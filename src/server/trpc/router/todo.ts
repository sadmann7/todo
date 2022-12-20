import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),

  add: protectedProcedure
    .input(z.object({ label: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { label } = input;
      const userId = session.user.id;
      const todo = await prisma.todo.create({
        data: {
          label,
          creator: { connect: { id: userId } },
        },
      });
      return todo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean().optional(),
        label: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !input.completed, label: input.label },
      });
      return todo;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          completed: z.boolean().optional(),
          label: z.string().min(1).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id, data } = input;
      const todo = await prisma.todo.update({
        where: {
          id,
        },
        data,
      });
      return todo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      return await prisma.todo.delete({
        where: {
          id,
        },
      });
    }),

  deleteCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx;
    await prisma.todo.deleteMany({
      where: { completed: true },
    });
  }),
});
