"use client";
import React, { ChangeEvent, FormEvent } from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Input, { validateUserName, validatePassword } from "components/Input";
import Logo from "public/images/logo.png";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "axios";

type Credentials = {
  username: string;
  password: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeCreds = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await client.post(Endpoint.LOGIN, creds);
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-row w-4/5 justify-between items-center">
        <div className="w-1/2 flex flex-col items-center">
          <Image src={Logo} width={400} height={400} alt={"logo"} />
        </div>
        <form
          onSubmit={onSubmit}
          className="w-1/2 max-w-xl h-1/2 flex flex-col items-center bg-gray-900 p-10 "
        >
          <div className="flex flex-col w-full mt-5">
            <Input
              label="Username"
              autoFocus
              onChange={onChangeCreds("username")}
              validated={validateUserName}
              value={creds.username}
            />
          </div>
          <div className="flex flex-col w-full mt-5">
            <Input
              label="Password"
              onChange={onChangeCreds("password")}
              validated={validatePassword}
              value={creds.password}
              ref={inputRef}
            />
          </div>
          <button
            type="submit"
            className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300"
          >
            Login
          </button>
          <p className="text-white text-center mt-2">
            {`Can't remember an account? `}
            <a href="/dashboard/forgotpassword" className="text-blue-600">
              Forgot Password
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;

const INITIAL_VALUES = {
  username: "",
  password: "",
};
