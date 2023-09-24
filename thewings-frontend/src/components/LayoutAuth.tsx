import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LayoutAuth = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </div>
  );
};
export default LayoutAuth;
