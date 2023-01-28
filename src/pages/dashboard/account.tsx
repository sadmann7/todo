import DefaultLayout from "@/layouts/DefaultLayout";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { type NextPageWithLayout } from "../_app";

const Account: NextPageWithLayout = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Account | Todo</title>
      </Head>
      <main className="mx-auto min-h-screen max-w-screen-sm pt-20 pb-14">
        {status === "loading" ? (
          <p className="text-base md:text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col gap-5">
            <table>
              <tbody>
                <tr>
                  <td className="w-14">Name:</td>
                  <td>{session?.user?.email}</td>
                </tr>
                <tr>
                  <td className="w-14">Email:</td>
                  <td>{session?.user?.name}</td>
                </tr>
              </tbody>
            </table>
            <button
              aria-label="sign out"
              className="w-fit rounded-sm bg-red-500 px-4 py-1.5 text-xs font-medium transition-opacity hover:bg-opacity-80 active:bg-opacity-100 md:text-sm"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        )}
      </main>
    </>
  );
};

Account.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Account;
