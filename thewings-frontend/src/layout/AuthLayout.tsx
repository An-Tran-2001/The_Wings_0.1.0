import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/layout/Footer";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </div>
  );
};
export default AuthLayout;
