import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";

// images import
import {
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav
      aria-label="navbar"
      className="fixed top-0 left-0 z-20 flex w-full items-center gap-4 bg-violet-500 py-2"
    >
      <div className="mx-auto flex w-[89vw] max-w-screen-xl items-center justify-between">
        <Link
          href="/"
          className="gap-1.5text-base flex items-center gap-1.5 font-mono transition-opacity hover:opacity-80 active:opacity-100 md:text-lg"
        >
          <CheckBadgeIcon className="aspect-square w-5" aria-hidden="true" />
          Todo
        </Link>
        {session?.user ? (
          <Menu as="div" className="relative inline-block">
            <Menu.Button className="rounded-full ring-2 ring-white/75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <Image
                src={session.user.image as string}
                alt={session.user.name as string}
                width={32}
                height={32}
                className="rounded-full"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-1 w-40 origin-top-right rounded-md bg-gray-600 p-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:text-sm">
                <Menu.Item>
                  {({ active }) => (
                    <Link href={"/dashboard/account"}>
                      <button
                        aria-label="navigate to account page"
                        className={`${
                          active ? "bg-black/20" : "bg-transparent"
                        } group flex w-full items-center rounded-md px-2 py-2`}
                      >
                        <UserCircleIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        {session?.user?.name}
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      aria-label="sign out"
                      className={`${
                        active ? "bg-black/20" : "bg-transparent"
                      } group flex w-full items-center rounded-md px-2 py-2`}
                      onClick={() => signOut()}
                    >
                      <ArrowLeftOnRectangleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <button
            aria-label="sign in"
            className="rounded-full bg-white/25 px-5 py-1.5 text-sm font-semibold text-white no-underline transition hover:bg-white/30 active:bg-white/20 md:text-base"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
