import { ReactElement } from "react";
import { DashboardLayout } from "../../layout";
import { Stack } from "@mui/material";
import CreatePost from "../../components/post/CreatePost";
import Post from "../../components/post/Post";

const Page = () => {
  return (
    <Stack
      minHeight="min-content"
      height="1000px"
      bgcolor="#202b2e61"
      justifyContent="center"
      alignItems="center"
    >
      <CreatePost />
      <Post title="Title" content="Content" file="File" createdAt="CreatedAt" updatedAt="UpdatedAt" tags={["Tags"]} user={{ name: "Name", profile: "Profile" }} />
    </Stack>
  );
};

export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
