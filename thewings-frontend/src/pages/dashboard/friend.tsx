import { ReactElement, useEffect, useState } from "react";
import { DashboardLayout } from "../../layout";
import Friend from "screens/friend";
import useFriend from "store/friend/selector";
import useProfiles from "store/profile/selector";
const Page = () => {
    const { onGetFriends, onGetRequests , onGetBlockUser} = useFriend();
    const {user} = useProfiles();
    useEffect(() => {
        const fetchData = async () => {
            await onGetFriends();
            await onGetRequests();
            await onGetBlockUser();
        };
        fetchData();
    }, [onGetFriends, user, onGetRequests, onGetBlockUser]);
    return <Friend />
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};