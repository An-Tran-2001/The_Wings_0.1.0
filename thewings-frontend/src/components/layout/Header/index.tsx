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
      height="8vh"
    >
      <p className="text-white text-2xl font-semibold">TheWings</p>

      <Search width={600} />
      <Nav />
    </Stack>
  );
};

export default Header;
