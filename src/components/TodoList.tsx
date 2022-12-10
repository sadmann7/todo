import { Fragment, useEffect, useState } from "react";
import {
  useForm,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
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
  const { data, status } = trpc.todo.getAllTodos.useQuery();
  useEffect(() => {
    if (!data) return;
    setTodos(data);
  }, [data]);
  const { mutate: addTodo } = trpc.todo.addTodo.useMutation({
    onSuccess: (todo) => {
      setTodos((prev) => [...prev, todo]);
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
    toast.success("Todo added.");
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
              <TodoItem register={register} todo={todo} />
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

const TodoItem = ({
  register,
  todo,
}: {
  register: UseFormRegister<Inputs>;
  todo: Todo;
}) => {
  const [isHoverd, setIsHoverd] = useState(false);

  return (
    <div
      className="border-b-1 flex cursor-pointer items-center justify-between gap-2 border-b-2 border-b-gray-700 pb-2.5"
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <div className="flex items-center gap-5">
        <input
          id="progress"
          type="checkbox"
          className="focus:ring-none rounded-full border-2 bg-transparent"
          {...register("progress", { required: false })}
        />
        <p className="text-xs line-clamp-1 md:text-sm">{todo.label}</p>
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
          />
        </div>
      )}
    </div>
  );
};
