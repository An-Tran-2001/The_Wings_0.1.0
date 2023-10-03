import { DashboardLayout } from "layout";
import { ReactElement, useEffect } from "react";
import { useAuth } from "store/auth";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";

const Page = () => {
  const { user } = useAuth();
  const { posts , onGetPosts } = usePost();
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await onGetPosts();
      }
    };

    fetchData();
  }, [onGetPosts, user?.username]);
  return <Profile users_info={user} onSubmit={onGetPosts} />;
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
