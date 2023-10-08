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
import { LikeSet } from "store/post/actions";
import { LikeStatus } from "constant/enum";
import { DataComment } from "store/post/reducer";
import { Router } from "next/router";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PostStatusIcon from "components/PostStatusIcon";
import { Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

export const StyledBadge = styled(Badge)(({ theme }) => ({
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

type NextLinkProps = {
  link_post: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Post = (props: NextLinkProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const { link_post, children, className, onClick } = props;
  const { posts } = usePost();
  const {onLikePost, onViewPost} = usePost();
  const [creds, setCreds] = useState<LikeSet>(INITIAL_VALUES_LIKE_POST);
  const handleLikePost = async  (payload: LikeSet) => {
    await onLikePost(payload);
  };
  const handleViewPost = async (payload: Post) => {
    await onViewPost(payload);
  }
  const handleMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  return (
    <Stack>
      {posts?.length > 0 ? (
        posts.map((item) => (
          <Stack
            key={item.id}
            flex="1"
            justifyContent="space-between"
            alignContent="center"
            className="w-[600px] box-border m-1 bg-neutral-900 rounded-2xl transition duration-300 hover:shadow-lg"
          >
            <Stack
              direction="row"
              p={1}
              className="items-center w-full justify-between"
            >
              <Stack direction="row">
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
                  <h1 className="text-[16px]">{item.author.name}</h1>
                  <p className="text-[12px] flex flex-row">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                    <PostStatusIcon status={item.status} />
                  </p>
                </Stack>
                <Stack direction="row" className="flex items-center">
                  <AvatarGroup max={3} className="mx-2">
                    {item.tags?.data.map((user) => (
                      <Avatar
                        key={user.id}
                        alt={user.name}
                        src={"http://localhost:8000" + user.avatar}
                        sx={{ width: 24, height: 24 }}
                      />
                    ))}
                  </AvatarGroup>
                </Stack>
              </Stack>
              <div className="right-0">
                <MoreHorizIcon
                  onClick={handleMenuClick}
                  className="ml-auto text-[30px] mx-2"
                />
                <Menu
                  open={open}
                  id="profile-menu"
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem>Change</MenuItem>
                  <MenuItem>Delete post</MenuItem>
                  <MenuItem>Block {item.author?.name}</MenuItem>
                </Menu>
                <CloseIcon className="ml-auto text-[30px] mx-2" />
              </div>
            </Stack>
            <Stack>
              <p className="px-3 py-1">{item.content}</p>
              {item.files?.data.length === 1 ? (
                <Image
                  key={item.files.data[0].id}
                  src={item.files.data[0].file}
                  width={600}
                  height={600}
                  alt={item.files.data[0].name || "image"}
                />
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {item.files?.data.map((file) => (
                    <Image
                      key={file.id}
                      src={file.file}
                      width={300}
                      height={300}
                      alt={file.name || "image"}
                    />
                  ))}
                </div>
              )}
            </Stack>
            <div className="grid grid-cols-2 b-0 p-4">
              <div className="col-span-1 text-center">
                <div
                  className="flex items-center justify-center space-x-2"
                  onClick={() =>
                    handleLikePost({
                      status: LikeStatus.LIKE,
                      post: item.id,
                    })
                  }
                >
                  <ThumbUpOffAltIcon />
                  {item.likes?.data && item.likes?.data.length > 0 ? (
                    <AvatarGroup max={3} className="mx-2">
                      {item.likes?.data.map((info) => (
                        <Avatar
                          key={info.user.id}
                          alt={info.user.name}
                          src={"http://localhost:8000" + info.user.avatar}
                          sx={{ width: 20, height: 20 }}
                        />
                      ))}
                    </AvatarGroup>
                  ) : (
                    <></>
                  )}
                  <p>Like {item.likes?.count}</p>
                </div>
              </div>
              <div className="col-span-1 text-center space-x-2 flex justify-center items-center">
                <Link
                  href={link_post}
                  passHref
                  onClick={() => handleViewPost(item)}
                  className="w-full flex justify-center items-center space-x-2 cursor-pointer hover:text-primary"
                >
                  <AddCommentIcon />
                  <p>Comment {item.comments?.count}</p>
                </Link>
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

export default React.memo(Post);
const INITIAL_VALUES_LIKE_POST = {
  status: LikeStatus.DISLIKE,
  post: 0,
};