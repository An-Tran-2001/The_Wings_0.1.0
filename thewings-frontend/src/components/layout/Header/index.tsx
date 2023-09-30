import { Stack } from "@mui/material";
import Nav from "./Nav";
import Search from "./Search";
import Link from "next/link";
import { PROFILE_PATH } from "constant/path";

const Header = () => {
  return (
    <Stack
      direction="row"
      px={3}
      py={2}
      alignItems="center"
      justifyContent="space-between"
      height="8vh"
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Link href={PROFILE_PATH}>
          <Stack className="bg-blue-400 w-[40px] h-[40px] rounded-full" />
        </Link>
        <p className="text-white text-2xl font-semibold">TheWings</p>
      </Stack>

      <Search width={600} />
      <Nav />
    </Stack>
  );
};

export default Header;
