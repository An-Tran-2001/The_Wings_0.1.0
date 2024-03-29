import Input, { validatePassword, validateUserName } from "components/Input";
import { DASHBOARD_PATH, FORGOT_PASSWORD_PATH } from "constant/path";
import { AuthLayout } from "layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "public/images/logo.png";
import { ChangeEvent, FormEvent, ReactElement, useRef, useState } from "react";
import { useAuth } from "store/auth";

type Credentials = {
  username_email: string;
  password: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const { onLogin } = useAuth();
  const router = useRouter();

  const onChangeCreds = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onLogin(creds);
      router.push(DASHBOARD_PATH);
    } catch (error) {
      setIsError(true);
      inputRef.current?.focus();
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
              onChange={onChangeCreds("username_email")}
              validated={validateUserName}
              value={creds.username_email}
              type="text"
            />
          </div>
          <div className="flex flex-col w-full mt-5">
            <Input
              label="Password"
              onChange={onChangeCreds("password")}
              validated={validatePassword}
              value={creds.password}
              ref={inputRef}
              type="password"
            />
          </div>
          {isError && (
            <p className="text-red-500 text-center mt-2">
              Username or password is incorrect
            </p>
          )}
          <button
            type="submit"
            className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300"
          >
            Login
          </button>
          <p className="text-white text-center mt-2">
            {`Can't remember an account? `}
            <Link
              className="navbar-brand text-blue-600"
              key="3"
              href={FORGOT_PASSWORD_PATH}
            >
              Forgot Password
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

const INITIAL_VALUES = {
  username_email: "",
  password: "",
};
