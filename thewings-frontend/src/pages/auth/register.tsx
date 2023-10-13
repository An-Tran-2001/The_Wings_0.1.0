"use client";
import Input, {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUserName,
} from "components/Input";
import { CONFIRM_CODE_PATH } from "constant/path";
import { AuthLayout } from "layout";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { useAuth } from "store/auth";

type Credentials = {
  username: string;
  email: string;
  phone_number: string;
  name: string;
  tc?: boolean;
  password: string;
  password2: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
  const { onRegister } = useAuth();
  const router = useRouter();
  const [isError, setIsError] = useState<string>("");
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onRegister(creds);
      router.push({
        pathname: CONFIRM_CODE_PATH,
        query: {
          email: creds.email,
        },
      });
    } catch (error) {
      console.log('ko')
      setIsError("Error infomation not correct");
    } 
  };

  const onChangeCreds = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-3/5 p-10 bg-gray-900">
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Username"
            onChange={onChangeCreds("username")}
            validated={validateUserName}
            value={creds.username}
          />
          <Input
            label="Name"
            onChange={onChangeCreds("name")}
            value={creds.name}
          />
          <Input
            label="Email"
            onChange={onChangeCreds("email")}
            validated={validateEmail}
            value={creds.email}
          />
          <Input
            label="Phone"
            onChange={onChangeCreds("phone_number")}
            validated={validatePhone}
            value={creds.phone_number}
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
        </div>
        <div className="p-5 w-full flex flex-col items-center">
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="h-5 mx-2 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300"
            />
            <p> I agree to the terms and conditions</p>
          </div>
          <p className="text-red-500 text-center mt-2">{isError}</p>
          <button
            type="submit"
            className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

const INITIAL_VALUES = {
  username: "",
  name: "",
  email: "",
  tc: true,
  phone_number: "",
  password: "",
  password2: "",
};
