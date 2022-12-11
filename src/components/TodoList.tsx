import { Fragment, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { type Todo } from "@prisma/client";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// images import
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

type Inputs = {
  todo: string;
  progress: boolean;
};

const TodoList = () => {
  // trpc
  const [todos, setTodos] = useState<Todo[]>([]);
  const [checkedTodos, setCheckedTodos] = useState<Todo[]>([]);

  const { data: allTodos, status } = trpc.todo.getAllTodos.useQuery();
  useEffect(() => {
    if (!allTodos) return;
    setTodos(allTodos);

    const checkedItems = allTodos.filter((todo) => todo.checked);
    setCheckedTodos(checkedItems);
  }, [allTodos]);

  const { mutate: addTodo } = trpc.todo.addTodo.useMutation({
    onSuccess: (todo) => {
      setTodos([...todos, todo]);
      toast.success("Todo added.");
    },
  });

  const { mutate: deleteTodo } = trpc.todo.deleteTodo.useMutation({
    onSuccess: (todo) => {
      const newTodos = todos.filter((item) => item.id !== todo.id);
      setTodos(newTodos);
      toast.success("Todo deleted.");
    },
  });

  const { mutate: toggleTodo } = trpc.todo.toggleTodo.useMutation({
    onSuccess: (todo) => {
      // check if the todo is already checked
      if (checkedTodos.some((item) => item.id === todo.id)) {
        // remove the todo from the checkedTodos
        const newTodos = todos.filter((item) => item.id !== todo.id);
        setCheckedTodos(newTodos);
        // toast.success("Todo unchecked.");
      } else {
        // add it to the checked todos
        setCheckedTodos([...todos, todo]);
        // toast.success("Todo checked.");
      }
    },
  });

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
  const [todosRef] = useAutoAnimate<HTMLDivElement>();
  const [formRef] = useAutoAnimate<HTMLFormElement>();

  return (
    <section
      aria-label="todo wrapper"
      className="mx-auto flex w-[89vw] max-w-screen-sm flex-col"
    >
      {status === "loading" ? (
        <p className="mt-5 text-sm md:text-base">Loading todos...</p>
      ) : (
        <div className="mt-5 grid gap-5" ref={todosRef}>
          {todos?.map((todo) => (
            <Fragment key={todo.id}>
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
                checkedTodos={checkedTodos}
                toggleTodo={toggleTodo}
              />
            </Fragment>
          ))}
        </div>
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
          <div
            role="button"
            aria-label="add todo"
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => setShowInput(true)}
          >
            <PlusIcon className="aspect-square w-5 text-red-400" />
            <p className="text-xs text-gray-400 md:text-sm">Add todo</p>
          </div>
        )}
      </form>
    </section>
  );
};

export default TodoList;

type TodoItemProps = {
  todo: Todo;
  deleteTodo: ({ id }: { id: string }) => void;
  checkedTodos: Todo[];
  toggleTodo: ({ id, checked }: { id: string; checked: boolean }) => void;
};

const TodoItem = ({
  todo,
  deleteTodo,
  checkedTodos,
  toggleTodo,
}: TodoItemProps) => {
  const [isHoverd, setIsHoverd] = useState(false);

  return (
    <div
      className="border-b-1 flex cursor-pointer items-center justify-between gap-2 border-b-2 border-b-gray-700 pb-2.5"
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <div className="flex items-center gap-5">
        <input
          aria-label="check todo"
          id="progress"
          type="checkbox"
          className="focus:ring-none cursor-pointer rounded-full border-2 bg-transparent"
          onChange={() =>
            toggleTodo({
              id: todo.id,
              checked: checkedTodos.some((item) => item.id === todo.id)
                ? false
                : true,
            })
          }
        />
        <p
          className={`${
            todo.checked && "line-through"
          } text-xs line-clamp-1 md:text-sm`}
        >
          {todo.label}
        </p>
      </div>
      {isHoverd && (
        <div className="flex items-center gap-2">
          <PencilSquareIcon
            role="button"
            aria-label="edit todo"
            className="aspect-square w-5 text-gray-400 transition-colors hover:text-gray-300 active:text-gray-400"
          />
          <TrashIcon
            role="button"
            aria-label="delete todo"
            className="aspect-square w-5 text-gray-400 transition-colors hover:text-gray-300 active:text-gray-400"
            onClick={() => deleteTodo({ id: todo.id })}
          />
        </div>
      )}
    </div>
  );
};
