import { ReactElement, useEffect } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";
import CreatePost from "../../components/post/CreatePost";
import Post from "../../components/post/Post";
import { usePost } from "store/post/selector";
import { useAuth } from "store/auth";

const Page = () => {
  const { user } = useAuth();
  const { posts, onGetPostsHome, onDeletePost } = usePost();
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await onGetPostsHome(INITIAL_VALUES_PAGE);
      }
    };

    fetchData();
  }, [onGetPostsHome, onDeletePost, user?.username]);
    
  return (
    <Stack
      minHeight="min-content"
      justifyContent="center"
      alignItems="center"
      className="bg-neutral-950"
    >
      <Stack width="600px" margin={3}>
        <CreatePost onPosts={onGetPostsHome} />
      </Stack>
      <Post link_post="dashboard/post" />
    </Stack>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};


const INITIAL_VALUES_PAGE = {
  page: 1,
  page_size: 5,
};
