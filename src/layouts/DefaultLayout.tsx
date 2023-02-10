import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

// external imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [router, status]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
