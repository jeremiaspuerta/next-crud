import { ReactNode } from "react";
import NavBar from "./Navbar";
import { useSession, signIn, signOut } from "next-auth/react";

type LayoutType = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutType) {
  const { data: session } = useSession();

  return (
    <>
      <title>CRUD</title>

      {session &&  <NavBar />}
      
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
