import { DashboardLayout } from "layout";
import { ReactElement, useEffect } from "react";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";
import useProfiles from "store/profile/selector";

const Page = () => {
  const { user } = useProfiles();
  const { onGetOrtherPosts } = usePost();
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await onGetOrtherPosts(user?.username);
      }
    };

    fetchData();
  }, [onGetOrtherPosts, user?.username]);
  return <Profile users_info={user} onSubmit={onGetOrtherPosts} />;
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
