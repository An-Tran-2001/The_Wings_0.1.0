import { DashboardLayout } from "layout";
import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "store/auth";
import { usePost } from "store/post/selector";
import Profile from "components/layout/Profile";
import { useMyPics } from "store/mypics/selectors";
import { debounce } from "lodash";
import { Stack } from "@mui/material";

const Page = () => {
  const { user } = useAuth();
  const { myPosts, onGetPosts } = usePost();
  const {pics, fetchMyPics} = useMyPics();
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
        if (myPosts && myPosts.results.length >= myPosts.count) {
          return;
        }
        await onGetPosts(page);
      }
    };

    fetchData();
  }, [onGetPosts, user?.username, page]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        await fetchMyPics(INITIAL_VALUES_PAGE);
      }
    };

    fetchData();
  }
  , [fetchMyPics, user?.username]);
  return (
    <Stack flex={1} overflow="auto" onScroll={(e) => handleScroll(e) as any}>
      <Profile
        users_info={user}
        onSubmit={onGetPosts}
        review_pics={pics}
        posts={(myPosts && myPosts.results) || []}
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
};