import { ReactElement } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";

const Page = () => {
  return (
    <Stack
      minHeight="min-content"
      height="1000px"
      bgcolor="green"
      justifyContent="center"
      alignItems="center"
    >
      <p style={{ fontSize: 80, fontFamily: "cursive", letterSpacing: 30 }}>
        FAKEBOOK
      </p>
    </Stack>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
