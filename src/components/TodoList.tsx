import { Fragment, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { type Todo } from "@prisma/client";
import { toast } from "react-toastify";
import { useIsMutating } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// images import
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

type Inputs = {
  todo: string;
};

const TodoList = () => {
  // trpc
  const utils = trpc.useContext();
  const [todos, setTodos] = useState<Todo[]>([]);

  const { data: allTodos, status } = trpc.todo.all.useQuery(undefined, {
    staleTime: 3000,
  });
  useEffect(() => {
    if (!allTodos) return;
    setTodos(allTodos);
  }, [allTodos]);

  const { mutateAsync: addTodo } = trpc.todo.add.useMutation({
    onSuccess: async (todo) => {
      await utils.todo.all.cancel();
      setTodos([...todos, todo]);
      toast.success("Todo added.");
    },
  });

  const { mutateAsync: deleteCompletedTodos } =
    trpc.todo.deleteCompleted.useMutation({
      onMutate: async () => {
        await utils.todo.all.cancel();
        const newTodos = todos.filter((todo) => !todo.completed);
        setTodos(newTodos);
        toast.success("Completed todos cleared.");
      },
    });

  // Refetch todos
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.todo.all.invalidate();
    }
  }, [number, utils]);

  // React-hook-form
  const [showInput, setShowInput] = useState(false);
  const {
    register,
    setFocus,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    addTodo({ label: data.todo });
    setShowInput(false);
    reset();
  };
  useEffect(() => {
    setFocus("todo");
  }, [setFocus, showInput]);

  // AutoAnimate
  const [todosRef] = useAutoAnimate<HTMLUListElement>();
  const [formRef] = useAutoAnimate<HTMLFormElement>();

  // Toggle ShowInput via keyboard shortcut
  useEffect(() => {
    const toggleInput = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        setShowInput(!showInput);
      }
      if (e.key === "Escape") {
        setShowInput(false);
      }
    };
    document.addEventListener("keydown", toggleInput);
    return () => document.removeEventListener("keydown", toggleInput);
  }, [showInput]);

  return (
    <section
      aria-label="todo wrapper"
      className="mx-auto flex w-[89vw] max-w-screen-sm flex-col"
    >
      <p className="text-center text-sm font-semibold italic md:text-base">
        Press{" "}
        <span className="text-red-400">
          {"Ctrl"} + {"k"}
        </span>{" "}
        to add todo
      </p>
      {status === "loading" ? (
        <p className="mt-5 text-sm md:text-base">Loading todos...</p>
      ) : (
        <ul className="mt-5 grid gap-5" ref={todosRef}>
          {todos?.map((todo) => (
            <Fragment key={todo.id}>
              <TodoItem todo={todo} />
            </Fragment>
          ))}
        </ul>
      )}
      <form
        aria-label="todo_form"
        className="mt-5"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
      >
        {showInput ? (
          <Fragment>
            <input
              id="todo"
              type="text"
              placeholder="Type todo..."
              className="w-full rounded-md bg-black/50 px-4"
              {...register("todo", { required: true })}
            />
            <div className="mt-3 flex">
              <div className="ml-auto flex items-center space-x-3">
                <div
                  role="button"
                  aria-label="cancel"
                  className="cursor-pointer rounded-md bg-red-500 px-4 py-1.5 text-xs font-medium transition-opacity hover:bg-opacity-75 active:opacity-100 md:text-sm"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </div>
                <button
                  type="submit"
                  aria-label="add todo"
                  className={`${
                    isValid
                      ? "cursor-pointer transition-opacity hover:bg-opacity-75 active:opacity-100"
                      : "cursor-not-allowed"
                  } rounded-md bg-green-500 px-4 py-1.5 text-xs font-medium md:text-sm`}
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid}
                >
                  Add todo
                </button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="flex items-center justify-between gap-5">
            <div
              role="button"
              aria-label="add todo"
              className="flex cursor-pointer items-center space-x-2 transition-opacity hover:opacity-80 active:opacity-100"
              onClick={() => setShowInput(true)}
            >
              <PlusIcon
                aria-hidden="true"
                className="aspect-square w-5 text-red-400"
              />
              <p className="text-xs text-gray-400 md:text-sm">Add todo</p>
            </div>
            {todos.some((todo) => todo.completed) && (
              <div
                role="button"
                aria-label="delete completed todos"
                className="flex cursor-pointer items-center space-x-2 text-xs text-gray-400 transition-opacity hover:opacity-80 active:opacity-100 md:text-sm"
                onClick={() => deleteCompletedTodos()}
              >
                Delete completed
              </div>
            )}
          </div>
        )}
      </form>
    </section>
  );
};

export default TodoList;

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isHoverd, setIsHoverd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [todoLabel, setTodoLabel] = useState(todo.label);

  // trpc
  const utils = trpc.useContext();

  const { mutateAsync: editTodo } = trpc.todo.edit.useMutation({
    onMutate: async ({ id, data }) => {
      await utils.todo.all.cancel();
      const allTodos = utils.todo.all.getData();
      if (!allTodos) return;
      utils.todo.all.setData(
        undefined,
        allTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...data,
              }
            : todo
        )
      );
      toast.success("Todo updated.");
    },
  });

  const { mutateAsync: deleteTodo } = trpc.todo.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.todo.all.cancel();
      const allTodos = utils.todo.all.getData();
      if (!allTodos) return;
      const newTodos = allTodos.filter((todo) => todo.id !== id);
      utils.todo.all.setData(undefined, newTodos);
      toast.success("Todo deleted.");
    },
  });

  return (
    <li
      className={`border-b-1 flex cursor-pointer border-b-2 border-b-gray-700 pb-2.5 ${
        isEditing ? "flex-col" : "flex-row items-center justify-between gap-2"
      }`}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      onDoubleClick={() => setIsEditing(!isEditing)}
    >
      {isEditing ? (
        <Fragment>
          <input
            id="editableTodo"
            type="text"
            className="w-full rounded-md bg-black/50 px-4"
            onChange={(e) => {
              setTodoLabel(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && todoLabel.length > 0) {
                editTodo({
                  id: todo.id,
                  data: { label: todoLabel },
                });
                setIsEditing(false);
              }
            }}
            defaultValue={todoLabel}
            autoFocus={isEditing}
          />
          <div className="mt-3 flex">
            <div className="ml-auto flex items-center space-x-3">
              <div
                role="button"
                aria-label="cancel"
                className="cursor-pointer rounded-md bg-red-500 px-4 py-1.5 text-xs font-medium transition-opacity hover:bg-opacity-75 active:opacity-100 md:text-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                Cancel
              </div>
              <button
                type="submit"
                aria-label="add todo"
                className={`${
                  todoLabel.length > 0
                    ? "cursor-pointer transition-opacity hover:bg-opacity-75 active:opacity-100"
                    : "cursor-not-allowed"
                } rounded-md bg-green-500 px-4 py-1.5 text-xs font-medium md:text-sm`}
                onClick={() => {
                  editTodo({
                    id: todo.id,
                    data: { label: todoLabel },
                  });
                  setIsEditing(false);
                }}
                disabled={todoLabel.length <= 0}
              >
                Save
              </button>
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="flex items-center gap-5">
          <input
            aria-label="check todo"
            id="progress"
            type="checkbox"
            className="focus:ring-none cursor-pointer rounded-full border-2 bg-transparent"
            checked={todo.completed}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              editTodo({
                id: todo.id,
                data: { completed: checked },
              });
            }}
            autoFocus={isEditing}
          />
          <p
            className={`${
              todo.completed && "line-through"
            } text-xs line-clamp-1 md:text-sm`}
          >
            {todoLabel}
          </p>
        </div>
      )}
      {isHoverd && !isEditing && (
        <div className="flex items-center gap-2">
          <PencilSquareIcon
            role="button"
            aria-label="edit todo"
            className="aspect-square w-5 text-gray-400 transition-colors hover:text-gray-300 active:text-gray-400"
            onClick={() => setIsEditing(true)}
          />
          <TrashIcon
            role="button"
            aria-label="delete todo"
            className="aspect-square w-5 text-gray-400 transition-colors hover:text-gray-300 active:text-gray-400"
            onClick={() => deleteTodo({ id: todo.id })}
          />
        </div>
      )}
    </li>
  );
};
