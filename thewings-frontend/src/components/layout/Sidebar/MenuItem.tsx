import { Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, memo } from "react";
import { twMerge } from "tailwind-merge";

type MenuItemProps = {
  label: string;
  icon: ReactNode;
  path: string;
};

const MenuItem = (props: MenuItemProps) => {
  const { label, icon, path } = props;
  const { pathname } = useRouter();
  return (
    <Stack component="li">
      <Link
        href={path}
        className={twMerge(
          "flex items-center text-white rounded-md p-2 font-semibold min-w-[200px] hover:bg-blue-300 hover:text-black " +
            (pathname === path && "bg-blue-300 text-black"),
        )}
      >
        {icon}
        {label}
      </Link>
    </Stack>
  );
};

export default memo(MenuItem);
