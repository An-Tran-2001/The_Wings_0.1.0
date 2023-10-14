import { Avatar, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Button from "components/Button";
import { memo, useState } from "react";
import { User } from "store/auth";
import useFriend from "store/friend/selector";
import { deepOrange } from "@mui/material/colors";
import { useRouter } from "next/router";
import useProfiles from "store/profile/selector";
import {  blockUserPayload } from "store/friend/actions";

const FriendCard = (user: User) => {
  const {onRemoveFriend, onAcceptRequest, onBlockUser, onunBlockUser} = useFriend();
  const { onGetProfile } = useProfiles();
  const router = useRouter();
  const onSubmitRemoveFriend = async () => {
    try {
      await onRemoveFriend(user.username);
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmitAcceptRequest = async () => {
    try {
      await onAcceptRequest({ friend_id: user.id });
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmitBlockUser = async () => {
    try {
      await onBlockUser({black_friend: user.id})
    } catch (error) {
      console.log(error);
    }
  }
  const onSubmitUnBlockUser = async () => {
    try {
      await onunBlockUser(user.id)
    } catch (error) {
      console.log(error);
    }
  }

  const nextOrtherProfile = async () => {
    try {
      await onGetProfile(user.username);
    } catch (error) {
      console.log(error);
    } finally {
      await router.push("orther_profile");
    }
  };
  return (
    <Stack
      spacing={1}
      sx={{
        cursor: "pointer",
        "&>.img-wrapper>img": {
          transitionDuration: "300ms",
        },
        ":hover": {
          "&>.img-wrapper>img": {
            transform: "scale(1.2)",
          },
        },
      }}
    >
      <Stack className="img-wrapper" width={250} height={250} overflow="hidden">
        {user.avatar ? (
          <Image
            src={"http:localhost:8000" + user.avatar}
            alt="name"
            width={800}
            height={800}
            style={{
              borderRadius: 6,
              objectFit: "cover",
            }}
          />
        ) : (
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              width: 250,
              height: 250,
              fontSize: 80,
            }}
            variant="square"
          >
            {user.name[0]}
          </Avatar>
        )}
      </Stack>
      <Typography fontWeight={600} mb={2}>
        {user.name}
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center">
        {user.isfriend ? (
          <Button content="Details" onClick={nextOrtherProfile} />
        ) : user.receive_request ? (
          <Button
            content="Accept"
            style={{ backgroundColor: "#60A5FA", color: "#fff" }}
            onClick={onSubmitAcceptRequest}
          />
        ) : null}
        {user.isfriend ? (
          <Button
            content="Unfriend"
            style={{ backgroundColor: "#F87171", color: "#fff" }}
            onClick={onSubmitRemoveFriend}
          />
        ) : user.receive_request ? (
          <Button
            content="Decline"
            style={{ backgroundColor: "#F87171", color: "#fff" }}
            onClick={onSubmitRemoveFriend}
          />
        ) : null}
        {user.isfriend ? (
          <Button
            content="Block"
            style={{ backgroundColor: "#F87171", color: "#fff" }}
            onClick={onSubmitBlockUser}
          />
        ) : null}
        {!(user.isfriend || user.receive_request || user.receive_request) && (
          <Button
            content="Unblock"
            style={{ backgroundColor: "#60A5FA", color: "#fff" }}
            onClick={onSubmitUnBlockUser}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default memo(FriendCard);

const INIT_VALUES_BLOCK_USER = {
  black_friend: 0,
};
