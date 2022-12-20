import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const todoRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany();
  }),

  add: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const todo = await ctx.prisma.todo.create({
      data: {
        label: input,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
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
      const uniqueTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });
      if (!uniqueTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo with id: ${input.id} not found!`,
        });
      }
      const todo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed, label: input.label },
      });
      return todo;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const uniqueTodo = await ctx.prisma.todo.findUnique({
        where: { id: input },
      });
      if (!uniqueTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo with id: ${input} not found!`,
        });
      }
      return await ctx.prisma.todo.delete({
        where: { id: input },
      });
    }),

  deleteMany: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.todo.deleteMany({
      where: { completed: true },
    });
  }),
});
