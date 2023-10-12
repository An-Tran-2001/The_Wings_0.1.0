import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useAuth } from "store/auth";
import { useRouter } from "next/router";
import { HOME_PATH, PROFILE_PATH } from "constant/path";
import Image from "next/image";
import { ImageAspectRatio } from "@mui/icons-material";

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const { onLogout } = useAuth();
  const router = useRouter();
  const { user } = useAuth();
  const handleMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleOpenProfile = () => {
    handleClose();
    router.push(PROFILE_PATH);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      handleClose();
      router.push(HOME_PATH);
    } catch (error) {
      console.log(error);
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
      {user?.avatar ? (
        <Image onClick={handleMenuClick} src={"http://localhost:8000" + user?.avatar} alt="123" width={50} height={50} style={{ objectFit: "cover", borderRadius: "50%", height: "100%" }} />
      ) : (
        <Avatar onClick={handleMenuClick} sx={{ width: 40, height: 40 }} className="absolute inset-0" />
      )}
      <Menu
        open={open}
        id="profile-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Stack>
  );
};

export default Nav;
