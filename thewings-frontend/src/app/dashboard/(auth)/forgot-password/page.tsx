"use client";
import client from "api/client";
import Endpoint from "api/endpoint";
import Input, {
  validateCode,
  validateEmail,
  validatePassword,
} from "components/Input";
import { useRouter } from "next/router";
import { FormEvent, MouseEvent, useState } from "react";

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
      push("/", undefined, { shallow: true });
    } catch (err) {
      console.log(err);
      setError(error);
    }
    setLoading(false);
  };

  const onChangeCreds =
    (name: string) => (event: FormEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.currentTarget.value }));

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="3xl flex flex-col items-center justify-center p-10 bg-gray-900">
        <h1 className="text-3xl text-white font-serif font-light tracking-wide">
          FORGOT PASSWORD
        </h1>
        <div className="flex flex-col w-full mt-5">
          <Input
            label="Email"
            onChange={onChangeCreds("email")}
            validated={validateEmail}
            value={creds.email}
          />
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
          />
          <Input
            label="Confirm Password"
            onChange={onChangeCreds("confirmPassword")}
            validated={validatePassword}
            value={creds.confirmPassword}
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
          {`Don't have an account?`} <a href="dashboard/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Page;

const INITIAL_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
};
