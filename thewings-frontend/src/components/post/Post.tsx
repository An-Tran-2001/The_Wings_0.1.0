import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import AvatarGroup from '@mui/material/AvatarGroup'

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

type PostProps = {
  title: string;
  content: string;
  file: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  user: {
    name: string;
    profile: string;
  };
};

const Post = ({
  title,
  content,
  file,
  createdAt,
  updatedAt,
  tags,
  user,
}: PostProps) => {
  const { name, profile } = user;
  return (
    <Stack flex="1" justifyContent="space-between" className="w-[600px] box-border m-3 bg-neutral-950 rounded-2xl">
      <Stack direction="row" p={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          className="mr-3"
        >
          <Avatar alt="" src="" />
        </StyledBadge>
        <Stack>
          <h1>{name}
          </h1>
          <p className="text-[12px]">{createdAt}</p>
        </Stack>
        <CloseIcon className="ml-auto text-[25px]" />
      </Stack>
      <Stack>
        <p>{content}</p>
        <Image src="https://th.bing.com/th/id/OIP.GFE8Wykppv-pGDw_CV4OeQAAAA?pid=ImgDet&rs=1" alt="" width={600} height={300} className="object-cover w-full h-[750px]" />
      </Stack>
      <Stack className="grid grid-cols-2 b-0 p-4">
        <Stack className="col-span-1 text-center">
          <p>Like</p>
        </Stack>
        <Stack className="col-span-1 text-center">
          <p>Comment</p>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Post;
