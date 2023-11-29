import { DashboardLayout } from "layout";
import { ReactElement, useEffect, useState } from "react";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";
import useProfiles from "store/profile/selector";
import { useMyPics } from "store/mypics/selectors";
import { debounce } from "lodash";
import { Stack } from "@mui/material";

const Page = () => {
  const { user } = useProfiles();
  const { yourPosts, onGetOrtherPosts, onResetYourPosts } = usePost();
  const { pics, fetchYoursPics } = useMyPics();
  INITIAL_VALUES_PAGE.username = user?.username || "";
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
        await fetchYoursPics(INITIAL_VALUES_PAGE);
        await onResetYourPosts();
      }
      setPage(INITIAL_VALUES_PAGE);
    };

    fetchData();
  }, [fetchYoursPics, user?.username]);
  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        if (
          yourPosts &&
          yourPosts.results && yourPosts.results.length >= yourPosts.count &&
          yourPosts.results[0].author.username === user?.username
        ) {
          console.log("yourPosts", yourPosts);
          return;
        };
        page.username = user?.username || "";
        console.log("page", page);
        await onGetOrtherPosts(page); 
      }
    };
    fetchData();
  }, [onGetOrtherPosts, user?.username, page]);
  return (
    <Stack flex={1} overflow="auto" onScroll={(e) => handleScroll(e) as any}>
      <Profile
        users_info={user}
        onSubmit={onGetOrtherPosts}
        review_pics={pics}
        posts={(yourPosts && yourPosts.results) || []}
        paramsOnPosts={INITIAL_VALUES_PAGE}
      />
    </Stack>
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