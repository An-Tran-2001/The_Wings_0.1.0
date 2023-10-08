import { Stack, Typography } from "@mui/material";
import FriendCard from "./FriendCard";
import useFriend from "store/friend/selector";
import { User } from "store/auth";
import { getFriendRequestResponse } from "store/friend/reducer";

const Friend = () => {
  const { friends, request } = useFriend();
  return (
    <Stack
      flex={1}
      overflow="hidden"
      width="100%"
      spacing={2}
    >
      <FriendList title="Friends" data={friends} />
      <FriendList title="Friends Request" data={request} />
    </Stack>
  );
};

const FriendList = ({ title, data }: { title: string; data: User[] | getFriendRequestResponse}) => {
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
        {data
          ? data.map((item) =>
              item.friend && item.friend ? (
                <FriendCard
                  key={item.friend.id}
                  {...item.friend}
                />
              ) : (
                <FriendCard key={item.id} {...item} />
              ),
            )
          : null}
      </Stack>
    </Stack>
  );
};

export default Friend;
