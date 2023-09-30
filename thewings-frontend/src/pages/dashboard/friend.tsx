import { ReactElement, useState } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";
const Friend = () => {
    return (
        <Stack flex={1} bgcolor="#15161661" justifyContent="center" alignItems="center">

        </Stack>
    );
};
export default Friend;

Friend.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};