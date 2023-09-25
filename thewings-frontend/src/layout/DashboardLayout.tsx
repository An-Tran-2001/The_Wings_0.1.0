import { Stack } from "@mui/material";
import { Header, Sidebar } from "components/layout";
import { ReactNode } from "react";

type IProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: IProps) => {
  return (
    <Stack flex={1} width="100vw" height="100vh">
      <Header />
      <Stack direction="row" flex={1}>
        <Sidebar />
        {children}
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
