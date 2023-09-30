import { Stack } from "@mui/material";
import { Header, Sidebar } from "components/layout";
import { ReactNode } from "react";

type IProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: IProps) => {
  return (
    <Stack
      flex={1}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      maxHeight="100vh"
    >
      <Header />
      <Stack direction="row" flex={1} height="92vh">
        <Sidebar />
        <Stack flex={1} overflow="auto">
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
