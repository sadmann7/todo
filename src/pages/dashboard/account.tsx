import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type NextPageWithLayout } from "../_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";

const Account: NextPageWithLayout = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Account | Todo</title>
      </Head>
      <main className="mx-auto grid min-h-screen max-w-screen-sm place-items-center pt-20 pb-14">
        {status === "loading" ? (
          <p className="text-base md:text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col items-center">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name as string}
              className="h-20 w-20 rounded-full"
              width={80}
              height={80}
            />
            <h1 className="mt-2 text-2xl font-bold">{session?.user?.name}</h1>
            <p className="mt-2 text-base md:text-sm">{session?.user?.email}</p>
            <Link
              aria-label="sign out"
              href="/api/auth/signout"
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Sign out
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

Account.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Account;
