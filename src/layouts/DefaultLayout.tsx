import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

// components imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/callback/discord");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <p role="progressbar" className="text-sm md:text-base">
        Loading...
      </p>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
