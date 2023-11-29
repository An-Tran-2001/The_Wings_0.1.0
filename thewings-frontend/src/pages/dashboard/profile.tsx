import { DashboardLayout } from "layout";
import { ReactElement, useEffect } from "react";
import { useAuth } from "store/auth";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";
import { useMyPics } from "store/mypics/selectors";

const Page = () => {
  const { user } = useAuth();
  const { onGetPosts } = usePost();
  const {pics, fetchMyPics} = useMyPics();
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await onGetPosts(INITIAL_VALUES_PAGE);
        fetchMyPics(INITIAL_VALUES_PAGE);
      }
    };

    fetchData();
  }, [onGetPosts, user?.username, fetchMyPics]);
  return <Profile users_info={user} onSubmit={onGetPosts} review_pics={pics} />;
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const INITIAL_VALUES_PAGE = {
  page: 1,
  page_size: 3,
};