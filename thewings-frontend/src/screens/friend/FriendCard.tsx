import { Stack, Typography } from "@mui/material";
import { FriendItem } from "./mock";
import Image from "next/image";
import Button from "components/Button";
import { memo } from "react";

const FriendCard = ({ id, name, avatar, isFriend = false }: FriendItem) => {
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
      <Stack className='img-wrapper' width={250} height={250} overflow='hidden'>
        <Image
          src={avatar}
          alt="name"
          width={800}
          height={800}
          style={{
            borderRadius: 6,
            objectFit: "cover",
          }}
        />
      </Stack>
      <Typography fontWeight={600} mb={2}>
        {name}
      </Typography>
      <Stack direction="row" spacing={3}>
        <Button content={isFriend ? "Details" : "Add friend"} />
        <Button
          content={isFriend ? "Remove friend" : "Remove"}
          style={{ backgroundColor: "#666666" }}
        />
      </Stack>
    </Stack>
  );
};

export default memo(FriendCard);
