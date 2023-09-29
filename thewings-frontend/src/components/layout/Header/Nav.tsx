import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Stack } from "@mui/material";

const Nav = () => {
  return (
    <Stack component="nav" direction="row" spacing={1} alignItems="center">
      <IconButton>
        <NotificationsIcon className="text-white" />
      </IconButton>
      <IconButton>
        <SettingsIcon className="text-white" />
      </IconButton>
      <div className="bg-blue-400 w-[40px] h-[40px] rounded-full" />
    </Stack>
  );
};

export default Nav;
