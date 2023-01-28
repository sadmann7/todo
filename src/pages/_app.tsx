import "@/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import type { ReactElement, ReactNode } from "react";
import { trpc } from "../utils/trpc";

// components imports
import ToastWrapper from "@/components/ToastWrapper";
import DefaultLayout from "@/layouts/DefaultLayout";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Head>
        <title>Todo</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <ToastWrapper />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
