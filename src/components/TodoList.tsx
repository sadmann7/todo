import { type Todo } from "@prisma/client";
import React from "react";

const TodoList = ({ todos }: { todos: Todo[] }) => {
  return (
    <section
      className="mx-auto flex w-[89vw] max-w-screen-sm flex-col items-center justify-center"
      aria-label="todo wrapper"
    >
      <h1 className="text-xl md:text-2xl">Todo</h1>
      <ul className="mt-5 grid gap-2">
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.label}</li>
        ))}
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
      </ul>
    </section>
  );
};

export default TodoList;
