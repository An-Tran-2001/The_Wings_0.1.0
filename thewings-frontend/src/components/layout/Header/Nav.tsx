import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Stack } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import GroupIcon from '@mui/icons-material/Group';

const Nav = () => {
  return (
    <Stack component="nav" direction="row" spacing={1} alignItems="center">
      <IconButton>
        <GroupIcon className="text-white" />
      </IconButton>
      <IconButton>
        <ForumIcon className="text-white" />
      </IconButton>
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
