import { ReactElement } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";

const Home = () => {
  return (
    <Stack flex={1} bgcolor="green" justifyContent="center" alignItems="center">
      <p style={{ fontSize: 80, fontFamily: "cursive", letterSpacing: 30 }}>
        FAKEBOOK
      </p>
    </Stack>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
