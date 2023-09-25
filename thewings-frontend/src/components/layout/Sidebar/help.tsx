import DashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";
import PeopleIcon from "@mui/icons-material/People";
import VideoIcon from "@mui/icons-material/OndemandVideoOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorderOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const iconStyles = {
  fontSize: "1.75rem",
  mr: 2,
  color: "inherit",
};

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: <DashboardOutlined sx={iconStyles} />,
    path: "/dashboard",
  },
  {
    label: "Friends",
    icon: <PeopleIcon sx={iconStyles} />,
    path: "/friends",
  },
  {
    label: "Videos",
    icon: <VideoIcon sx={iconStyles} />,
    path: "/watch",
  },
  {
    label: "Archives",
    icon: <BookmarkIcon sx={iconStyles} />,
    path: "/archives",
  },
  {
    label: "Groups",
    icon: <GroupsRoundedIcon sx={iconStyles} />,
    path: "/groups",
  },
  {
    label: "Games",
    icon: <SportsEsportsIcon sx={iconStyles} />,
    path: "/games",
  },
  // {
  //   label: "Dashboard",
  //   icon: <DashboardOutlined sx={iconStyles} />,
  //   path: "/dashboard",
  // },
  // {
  //   label: "Dashboard",
  //   icon: <DashboardOutlined sx={iconStyles} />,
  //   path: "/dashboard",
  // },
  // {
  //   label: "Dashboard",
  //   icon: <DashboardOutlined sx={iconStyles} />,
  //   path: "/dashboard",
  // },
  // {
  //   label: "Dashboard",
  //   icon: <DashboardOutlined sx={iconStyles} />,
  //   path: "/dashboard",
  // },
];
