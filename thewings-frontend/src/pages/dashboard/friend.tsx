import { ReactElement, useEffect, useState } from "react";
import { DashboardLayout } from "../../layout";
import Friend from "screens/friend";
import useFriend from "store/friend/selector";
import useProfiles from "store/profile/selector";
const Page = () => {
    const { onGetFriends, onGetRequests } = useFriend();
    const {user} = useProfiles();
    useEffect(() => {
        const fetchData = async () => {
            await onGetFriends();
            await onGetRequests();
        };
        fetchData();
    }, [onGetFriends, user, onGetRequests]);
    return <Friend />
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};