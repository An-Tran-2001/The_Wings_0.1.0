import { ButtonHTMLAttributes } from "react";

export type IButtonProps = {} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: IButtonProps) => {
  const { type, className, ...rest } = props;
  return (
    <button
      type={type}
      className={
        "text-white px-3 py-2 rounded-md bg-blue-600 mx-2 " + className
      }
      {...rest}
    />
  );
};
export default Button;
