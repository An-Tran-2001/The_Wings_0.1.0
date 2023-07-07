"use client";
import React, { FormEvent } from "react";
import { useState } from "react";
import Input, { validateCode } from "components/Input";
import { HttpStatusCode } from "axios";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { Endpoint, client } from "api";

const Page = () => {
  const [code, setCode] = useState<string>("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await client.post(Endpoint.CONFIRM_CODE, { code });
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }

      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {}
  };

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCode(event.currentTarget.value);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="3xl flex flex-col items-center justify-center p-10 bg-gray-900">
        <h1 className="text-3xl text-white font-serif font-light tracking-wide">
          CONFIRM CODE
        </h1>
        <form onSubmit={onSubmit} className="p-4">
          <Input
            label="Code"
            onChange={onChange}
            validated={validateCode}
            value={code}
          />
          <div className="w-full flex flex-col items-center mt-5">
            <button
              type="submit"
              className="mx-auto h-12 px-5 text-white font-semibold hover:bg-black transition duration-300"
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
