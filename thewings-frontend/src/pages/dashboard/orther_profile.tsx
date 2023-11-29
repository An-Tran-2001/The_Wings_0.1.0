import { DashboardLayout } from "layout";
import { ReactElement, useEffect } from "react";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";
import useProfiles from "store/profile/selector";
import { useMyPics } from "store/mypics/selectors";

const Page = () => {
  const { user } = useProfiles();
  const { onGetOrtherPosts } = usePost();
  const { pics, fetchYoursPics } = useMyPics();
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        INITIAL_VALUES_PAGE.username = user?.username;
        await onGetOrtherPosts(INITIAL_VALUES_PAGE);
        fetchYoursPics(INITIAL_VALUES_PAGE);
      }
    };

    fetchData();
  }, [onGetOrtherPosts, user?.username, fetchYoursPics]);
  return (
    <Profile users_info={user} onSubmit={onGetOrtherPosts} review_pics={pics} />
  );
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
const INITIAL_VALUES_PAGE = {
  page: 1,
  page_size: 3,
  username: "",
};