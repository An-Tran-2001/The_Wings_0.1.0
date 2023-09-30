"use client";
import client from "api/client";
import Endpoint from "api/endpoint";
import Input, {
  validateCode,
  validateEmail,
  validatePassword,
} from "components/Input";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactElement,
  useState,
} from "react";
import { CODE_COFIRM } from "constant/path";
import { REGISTER_PATH } from "constant/path";
import Link from "next/link";
import { AuthLayout } from "layout";
import { Button } from "@mui/material";

type Credentials = {
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const onSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await client.post(Endpoint.FORGOT_PASSWORD, creds);
      localStorage.setItem("token", res.data.token);
      // push("/", undefined, { shallow: true });
      push(CODE_COFIRM);
    } catch (err) {
      console.log(err);
      setError(error);
    }
    setLoading(false);
  };

  const onSubmitEmail = async () => {
    try {
      console.log("send");
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeCreds =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="3xl flex flex-col items-center justify-center p-10 bg-gray-900">
        <h1 className="text-3xl text-white font-serif font-light tracking-wide">
          FORGOT PASSWORD
        </h1>
        <div className="flex flex-col w-full mt-5">
          <div className="flex w-full">
            <Input
              label="Email"
              onChange={onChangeCreds("email")}
              validated={validateEmail}
              value={creds.email}
            />
            {creds.email && validateEmail(creds.email) && (
              <Button onClick={onSubmitEmail}>Send code</Button>
            )}
          </div>
          <Input
            label="Code"
            onChange={onChangeCreds("code")}
            validated={validateCode}
            value={creds.code}
          />
          <Input
            label="Password"
            onChange={onChangeCreds("password")}
            validated={validatePassword}
            value={creds.password}
            type="password"
          />
          <Input
            label="Confirm Password"
            onChange={onChangeCreds("confirmPassword")}
            validated={validatePassword}
            value={creds.confirmPassword}
            type="password"
          />
        </div>
        <p className="text-red-500">{error}</p>
        <button
          className="mt-5 hover:bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          onClick={onSubmit}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
        <p className="text-white text-center my-5">
          {`Don't have an account?`} <Link href={REGISTER_PATH}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
};
