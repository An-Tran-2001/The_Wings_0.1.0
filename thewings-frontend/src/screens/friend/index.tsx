import { Stack, Typography } from "@mui/material";
import { FRIENDS, FRIENDS_REQUEST, FriendItem } from "./mock";
import FriendCard from "./FriendCard";

const Friend = () => {
  return (
    <Stack
      flex={1}
      overflow="hidden"
      width="100%"
      spacing={2}
    >
      <FriendList title="Friends" data={FRIENDS} />
      <FriendList title="Friends Request" data={FRIENDS_REQUEST} />
    </Stack>
  );
};

const FriendList = ({ title, data }: { title: string; data: FriendItem[] }) => {
  return (
    <Stack spacing={3} width="100%">
      <Typography variant="h5">{title}</Typography>
      <Stack
        direction="row"
        spacing={3}
        p={1}
        mt={0}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {data.map((item) => (
          <FriendCard key={item.id} {...item} />
        ))}
      </Stack>
    </Stack>
  );
};

export default Friend;
