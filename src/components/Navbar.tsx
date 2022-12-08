import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

// images import
import {
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav
      aria-label="navbar"
      className="fixed top-0 left-0 w-full gap-4 bg-violet-500 py-2"
    >
      <div className="mx-auto flex w-[89vw] max-w-screen-xl items-center justify-between">
        <Link
          href="/"
          className="gap-1.5text-base flex items-center gap-1.5 font-mono transition-opacity hover:opacity-80 active:opacity-100 md:text-lg"
        >
          <CheckBadgeIcon className="aspect-square w-5" aria-hidden="true" />
          Todo
        </Link>
        {sessionData?.user ? (
          <Menu as="div" className="relative inline-block">
            <Menu.Button className="overflow-hidden rounded-full ring-2 ring-white/75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <Image
                src={sessionData.user.image as string}
                alt={sessionData.user.name as string}
                width={32}
                height={32}
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
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <UserCircleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      {sessionData?.user?.name}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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
