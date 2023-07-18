import { LOGIN_PATH } from "constant/path";
import Link from "next/link";
import React, { memo } from "react";

const Footer = () => {
  return (
    <div>
      <footer className="fixed bottom-0 w-full">
        <div className="container grid mx-auto grid-cols-4 content-center text-center font-mono font-light text-2xl p-5">
          {LINKS.map((link) => (
            <Link
              key={`footer_${link.id}`}
              href={link.url}
              className="text-white hover:text-gray-500"
            >
              {link.text}
            </Link>
          ))}
        </div>
        <p className="right-0 bottom-0 text-xs font-sans">
          Copyright &copy; 2023
        </p>
      </footer>
    </div>
  );
};

export default memo(Footer);

const LINKS = [
  {
    id: 1,
    text: "Read Docs",
    url: LOGIN_PATH,
  },
  {
    id: 2,
    text: "Services",
    url: LOGIN_PATH,
  },
  {
    id: 3,
    text: "Rules",
    url: LOGIN_PATH,
  },
  {
    id: 4,
    text: "Relationships",
    url: LOGIN_PATH,
  },
];
