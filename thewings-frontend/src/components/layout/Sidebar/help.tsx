import DashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";
import PeopleIcon from "@mui/icons-material/People";
import VideoIcon from "@mui/icons-material/OndemandVideoOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorderOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

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
    label: "Message",
    icon: <QuestionAnswerIcon sx={iconStyles} />,
    path: "/dashboard/message",
  },
  {
    label: "Friends",
    icon: <PeopleIcon sx={iconStyles} />,
    path: "/dashboard/friend",
  }
];
