"use client";
import Image from "next/image";
import Link from "next/link";
import { LOGIN_PATH, REGISTER_PATH } from "constant/path";
import { memo } from "react";
import Logo from "public/images/logo.png";

const Navbar = () => {
  return (
    <div className="w-full fixed top-0 flex items-center justify-center">
      <nav className="container items-center navbar navbar-expand-lg navbar-light bg-light flex justify-between my-10 p-5">
        <div>
          <Link className="navbar-brand" href="/">
            <Image src={Logo} alt="thewings" width={100} height={100} />
          </Link>
        </div>
        <div className="flex space-x-5">
          {LINKS.map((link) => (
            <Link
              className="navbar-brand text-white"
              key={link.id}
              href={link.url}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default memo(Navbar);

const LINKS = [
  {
    id: 1,
    text: "LOGIN",
    url: LOGIN_PATH,
  },
  {
    id: 2,
    text: "REGISTER",
    url: REGISTER_PATH,
  },
];
