import PeopleIcon from "@mui/icons-material/People";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";

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
  },
];
