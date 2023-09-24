import { InputHTMLAttributes, forwardRef } from "react";

const pattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
const validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateUserName = (value: string): string => {
  return value.length > 0 && value.length < 8
    ? "Username requires more than 8 characters"
    : "";
};

const validatePassword = (value: string): string => {
  return value.length > 0 && (value.length < 8 || !pattern.test(value))
    ? "Password requires more than 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character"
    : "";
};

const validateEmail = (value: string): string => {
  return value.length > 0 && !validRegex.test(value) ? "Email is invalid" : "";
};

const validatePhone = (value: string): string => {
  return value.length > 0 && value.length <= 10
    ? "Phone requires more than 10 numbers"
    : "";
};

const validateCode = (value: string): string => {
  return value.length > 0 && (value.length < 6 || value.length > 6)
    ? "Code requires 6 numbers"
    : "";
};

type InputProps = {
  label?: string;
  validated?(value: string): string;
  value?: string;
  type: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    const {
      name,
      label,
      value,
      validated,
      autoFocus = false,
      className,
      ...rest
    } = props;

    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-white font-semibold ">{label}</label>}
        <input
          name={name}
          autoFocus={autoFocus}
          ref={ref}
          className={
            "w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 " +
            className
          }
          {...rest}
        />
        <span className="text-xs text-red-500">
          {validated && validated(value || "")}
        </span>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
export {
  validateCode,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUserName,
};
