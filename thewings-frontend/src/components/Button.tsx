import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type IButtonProps = {} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: IButtonProps) => {
  const { type, className, content, ...rest } = props;
  return (
    <button
      type={type}
      className={twMerge(
        "text-white px-3 py-2 rounded-md bg-blue-600 ",
        className,
      )}
      {...rest}
    >
      {content}
    </button>
  );
};
export default Button;
