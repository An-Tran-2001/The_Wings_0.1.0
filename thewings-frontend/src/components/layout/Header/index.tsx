import { Stack } from "@mui/material";
import Nav from "./Nav";
import Search from "./Search";

const Header = () => {
  return (
    <Stack
      direction="row"
      px={3}
      py={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack className="bg-blue-400 w-[40px] h-[40px] rounded-full" />
        <p className="text-white text-2xl font-semibold">TheWings</p>
      </Stack>

      <Search className="px-3 py-2 h-auto text-white w-[600px] border-white outline-none"/>
      <Nav />
    </Stack>
  );
};

export default Header;