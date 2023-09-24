"use client";
import { Endpoint, client } from "api";
import { HttpStatusCode } from "axios";
import Input, {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUserName,
} from "components/Input";
import LayoutAuth from "components/LayoutAuth";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { ChangeEvent, FormEvent, useState } from "react";

type Credentials = {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Page = () => {
  const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);

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

  const onChangeCreds = (name: string) => {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setCreds((prev) => ({ ...prev, [name]: event.target.value }));
  };

  return (
    <LayoutAuth>
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
            onChange={onChangeCreds("phone")}
            validated={validatePhone}
            value={creds.phone}
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
        <div className="p-5 w-full flex flex-col items-center">
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="h-5 mx-2 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300"
            />
            <p> I agree to the terms and conditions</p>
          </div>
          <button
            type="submit"
            className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300"
          >
            Register
          </button>
        </div>
      </form>
    </div>
    </LayoutAuth>
  );
};

export default Page;

const INITIAL_VALUES = {
  username: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};
