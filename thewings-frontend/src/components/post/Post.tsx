import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import AvatarGroup from "@mui/material/AvatarGroup";
import { usePost } from "store/post/selector";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddCommentIcon from "@mui/icons-material/AddComment";

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

const Post = () => {
  const { post } = usePost();
  
  return (
    <Stack>
      {post?.length > 0 ? (
        post.map((item) => (
          <Stack
            key={item.id}
            flex="1"
            justifyContent="space-between"
            className="w-[600px] box-border m-3 bg-neutral-900 rounded-2xl"
          >
            <Stack direction="row" p={2}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                className="mr-3"
              >
                <Avatar
                  alt=""
                  src={"http://localhost:8000" + item.author.avatar}
                />
              </StyledBadge>
              <Stack>
                <h1>{item.author.name}</h1>
                <p className="text-[12px]">{item.created_at}</p>
              </Stack>
              <Stack>
                <AvatarGroup max={3}>
                  {item.tags?.data.map((user) => (
                    <Avatar
                      key={user.id}
                      alt={user.name}
                      src={"http://localhost:8000" + user.avatar}
                    />
                  ))}
                </AvatarGroup>
              </Stack>
              <CloseIcon className="ml-auto text-[25px]" />
            </Stack>
            <Stack>
              <p>{item.content}</p>
              {item.files?.data.map((file) => (
                <Image
                  key={file.id}
                  src={file.file}
                  width={200}
                  height={200}
                  alt={file.name || "image"}
                />
              ))}
            </Stack>
            <div className="grid grid-cols-2 b-0 p-4">
              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <ThumbUpOffAltIcon />
                  <p>Like {item.likes?.count}</p>
                </div>
              </div>
              <div className="col-span-1 text-center space-x-2 flex justify-center items-center">
                <AddCommentIcon />
                <p>Comment {item.comments?.count}</p>
              </div>
            </div>
          </Stack>
        ))
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default Post;
