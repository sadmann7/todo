import Head from "next/head";
import { type NextPageWithLayout } from "./_app";

// external imports
import TodoList from "@/components/TodoList";
import DefaultLayout from "@/layouts/DefaultLayout";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Todo</title>
      </Head>
      <main className="min-h-screen pt-20 pb-14">
        <TodoList />
      </main>
    </>
  );
};

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Home;
