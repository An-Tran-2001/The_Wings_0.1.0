import { ReactElement, memo, useEffect, useState } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";
import CreatePost from "../../components/post/CreatePost";
import PostComponent from "../../components/post/Post";
import { usePost } from "store/post/selector";
import { useAuth } from "store/auth";
import debounce from "lodash.debounce";

const Page = () => {
  const { user } = useAuth();
  const { homePosts, onGetPostsHome, onResetHomePosts } = usePost();
  const [page, setPage] = useState(INITIAL_VALUES_PAGE);

  const handleScroll = debounce((e: any) => {
    const currentListE = e.target;
    if (
      currentListE &&
      currentListE.scrollTop + currentListE.clientHeight + 1 >=
        currentListE.scrollHeight
    ) {
      setPage((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await onResetHomePosts();
        await onGetPostsHome(page);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        if (
          homePosts &&
          homePosts.results && homePosts.results.length >= homePosts.count
        ) {
          return;
        }
        if (page.page > 1) {
          await onGetPostsHome(page);
        }
      }
    };

    fetchData();
  }, [user?.username, page.page]);

  return (
    <Stack flex={1} overflow="auto" onScroll={(e) => handleScroll(e) as any}>
      <Stack
        minHeight="min-content"
        justifyContent="center"
        alignItems="center"
        className="bg-neutral-950"
      >
        <Stack width="600px" margin={3}>
          <CreatePost onPosts={onGetPostsHome} paramsOnPosts={INITIAL_VALUES_PAGE}/>
        </Stack>
        <PostComponent link_post="dashboard/post" posts={(homePosts && homePosts.results) || []} />
      </Stack>
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
