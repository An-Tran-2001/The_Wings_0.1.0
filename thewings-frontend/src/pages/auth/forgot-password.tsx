"use client";
import Input, {
  validateCode,
  validateEmail,
  validatePassword,
} from "components/Input";
import { LOGIN_PATH, REGISTER_PATH } from "constant/path";
import { AuthLayout } from "layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { useAuth } from "store/auth";

type Credentials = {
  email: string;
  password: string;
  password2: string;
  code: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const { onForgotPassword, onResetPassword } = useAuth();
  const router = useRouter();

  const handleSubmitEmail = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      await onForgotPassword({ email: creds.email });
    } catch (error) {
      console.log(error);
    } finally {
      setShow(true);
    }
  };

  const handleChangePassword = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      await onResetPassword(creds);
    } catch (error) {
      console.log(error);
    } finally {
      router.push(LOGIN_PATH);
    }
  };

  const onChangeCreds =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={show ? handleChangePassword : handleSubmitEmail}
        className="3xl flex flex-col items-center justify-center p-10 bg-gray-900"
      >
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
          {show && (
            <>
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
                onChange={onChangeCreds("password2")}
                validated={validatePassword}
                value={creds.password2}
                type="password"
              />
            </>
          )}
        </div>
        <p className="text-red-500">{error}</p>
        <button
          type="submit"
          className="mt-5 hover:bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          onClick={show ? handleChangePassword : handleSubmitEmail}
        >
          {show ? "Submit" : "Send code"}
        </button>
        <p className="text-white text-center my-5">
          {`Don't have an account?`} <Link href={REGISTER_PATH}>Register</Link>
        </p>
      </form>
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
  password2: "",
  code: "",
};
