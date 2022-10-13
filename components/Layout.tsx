import {  ReactNode } from "react";
import NavBar from "./Navbar";

type LayoutType = {
    children: ReactNode;
}

export default function Layout({ children }: LayoutType) {
    return (
      <>
        <title>CRUD</title>

        <NavBar />
        <main style={{marginTop:'5vh'}}>{children}</main>
        {/* <Footer /> */}
      </>
    )
  }
