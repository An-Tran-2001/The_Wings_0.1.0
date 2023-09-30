import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useAuth } from "store/auth";

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const { onLogout } = useAuth();

  const handleMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
    } finally {
      handleClose();
    }
  };

  return (
    <Stack component="nav" direction="row" spacing={1} alignItems="center">
      <IconButton>
        <NotificationsIcon className="text-white" />
      </IconButton>
      <IconButton>
        <SettingsIcon className="text-white" />
      </IconButton>
      <Stack
        onClick={handleMenuClick}
        className="bg-blue-400 w-[40px] h-[40px] rounded-full cursor-pointer"
      />
      <Menu
        open={open}
        id="profile-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default Nav;
