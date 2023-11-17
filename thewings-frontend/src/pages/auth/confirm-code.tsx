import React, { FormEvent, ReactElement, useEffect, useMemo } from "react";
import { useState } from "react";
import Input, { validateCode } from "components/Input";
import { HttpStatusCode } from "axios";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { Endpoint, client } from "api";
import { AuthLayout } from "layout";
import { useRouter } from "next/router";
import { useAuth } from "store/auth";
import { LOGIN_PATH } from "constant/path";

const Page = () => {
  const [code, setCode] = useState<string>("");

  const router = useRouter();
  const email = useMemo(() => router.query.email as string, []);
  const [isError, setIsError] = useState<string>("");
  const { onConfirmCode } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onConfirmCode({ email, code });
      router.push(LOGIN_PATH);
    } catch (error) {
      console.log(error);
      setIsError(AN_ERROR_TRY_AGAIN);
    } 
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
          {isError && (
            <p className="text-red-500 text-sm font-semibold">{isError}</p>
          )}
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

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
