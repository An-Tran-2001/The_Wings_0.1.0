import { Stack } from "@mui/material";
import MenuItem from "./MenuItem";
import { SIDEBAR_ITEMS } from "./help";

const Sidebar = () => {
  return (
    <Stack component="nav" p={2} height="100%">
      <Stack component="ul" justifyContent="center" spacing={1}>
        {SIDEBAR_ITEMS.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </Stack>
    </Stack>
  );
};

export default Sidebar;
