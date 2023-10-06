import { ReactElement, useState } from "react";
import { DashboardLayout } from "../../layout";
import Friend from "screens/friend";
const Page = () => {
    return <Friend />
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};