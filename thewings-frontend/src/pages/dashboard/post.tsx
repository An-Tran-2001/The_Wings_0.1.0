import { Avatar, Input, Stack } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import { DashboardLayout } from "layout";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";
import { Post } from "store/post/reducer";
import { usePost } from "store/post/selector";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CloseIcon from "@mui/icons-material/Close";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { LikeStatus } from "constant/enum";
import { CreateCommentPayload, LikeSet } from "store/post/actions";
import SendIcon from "@mui/icons-material/Send";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PostStatusIcon from "components/PostStatusIcon";
import { useAuth } from "store/auth";

const Page = () => {
    const { user } = useAuth();
    const { post, posts, onCommentPost, onLikePost } = usePost();
    const [inputComment, setInputComment] = useState<CreateCommentPayload>(INITIAL_VALUES);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
    if (post?.files?.data && post.files.data.length > 0) {
        setCurrentImageIndex((prevIndex) =>
        prevIndex === post.files.data.length - 1 ? 0 : prevIndex + 1,
        );
    }
    };

    const handlePrevImage = () => {
    if (post?.files?.data && post.files.data.length > 0) {
        setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? post.files.data.length - 1 : prevIndex - 1,
        );
    }
    };
    const handleLikePost = async (payload: LikeSet) => {
    console.log(payload);
    await onLikePost(payload);
    };
    const handleCommentPost = async () => {
    await onCommentPost(inputComment);
    setInputComment(INITIAL_VALUES);
    }
    useEffect(() => {
    if (post?.files?.data && post.files.data.length > 0) {
        inputComment.posts = post.id;
        setCurrentImageIndex(0);
    }
    }, [post, posts]);
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        className="text-white h-[92vh] p-3 bg-stone-800"
      >
        <Stack
          width="96%"
          height="95%"
          className="bg-neutral-950 rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 w-full h-full">
            <div className="col-span-2 relative w-full h-full overflow-hidden">
              <Stack className="max-h-full w-full h-full items-center justify-center pl-3 ">
                {post?.files?.data.length === 0 ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p>No Image</p>
                  </div>
                ) : post?.files?.data.length === 1 ? (
                  <Image
                    key={post?.files.data[0].id}
                    src={post?.files.data[0].file}
                    width={2000}
                    height={2000}
                    alt={post.files.data[0].name || "image"}
                  />
                ) : (
                  <div>
                    {post?.files?.data.map((file, index) => (
                      <>
                        <Image
                          key={file.name}
                          src={file.file}
                          width={2000}
                          height={2000}
                          alt={file.name || "image"}
                          style={{
                            display:
                              index === currentImageIndex ? "block" : "none",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <NavigateBeforeIcon
                          onClick={handlePrevImage}
                          className="absolute left-0 top-1/2"
                          style={{ fontSize: "3rem" }}
                        ></NavigateBeforeIcon>
                        <NavigateNextIcon
                          onClick={handleNextImage}
                          className="absolute right-0 top-1/2"
                          style={{ fontSize: "3rem" }}
                        ></NavigateNextIcon>
                      </>
                    ))}
                  </div>
                )}
              </Stack>
            </div>
            <Stack className="p-3">
              <div className="p-3 bg-gray-800 rounded-2xl h-full overflow-hidden">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row">
                    <Avatar
                      src={"http://localhost:8000" + post?.author?.avatar}
                      className="mx-3"
                    />
                    <div className="text-[12px] flex justify-center flex-col">
                      <p>{post?.author?.name}</p>
                      <p className="flex flex-row space-x-2">
                        {formatDistanceToNow(new Date(post?.created_at), {
                          addSuffix: true,
                        })}
                        {post && post.status !== undefined && (
                          <PostStatusIcon status={post.status} />
                        )}
                      </p>
                    </div>
                    <AvatarGroup max={4} spacing="small" className="mx-2">
                      {post?.tags?.data.map((user) => (
                        <Avatar
                          key={user.id}
                          alt={user.name}
                          src={user.avatar}
                          sx={{ width: 24, height: 24 }}
                        />
                      ))}
                    </AvatarGroup>
                  </div>
                  <Link href="/dashboard">
                    <CloseIcon className="ml-auto text-[25px]" />
                  </Link>
                </div>
                <div className="min-h-50px px-8 mt-3 mb-3">
                  <p className="text-[14px]">{post?.content}</p>
                </div>
                <div className="grid grid-cols-2 b-0 p-4">
                  <div className="col-span-1 text-center">
                    <div
                      className="flex items-center justify-center space-x-2 cursor-pointer"
                      onClick={() =>
                        handleLikePost({
                          status: post?.likes?.data.find(
                            (like) => like.user.id === user?.id,
                          )
                            ? LikeStatus.DISLIKE
                            : LikeStatus.LIKE,
                          post: post?.id,
                        })
                      }
                    >
                      {user.id &&
                      post?.likes?.data.some(
                        (info) => info.user.id === user.id,
                      ) ? (
                        <ThumbUpIcon />
                      ) : (
                        <ThumbUpOffAltIcon />
                      )}
                      {post?.likes?.data && post?.likes?.data.length > 0 ? (
                        <AvatarGroup
                          max={3}
                          className="mx-2"
                          style={{ fontSize: "10px" }}
                        >
                          {post?.likes?.data.map((info) => (
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
                      <p>Like {post?.likes?.count}</p>
                    </div>
                  </div>
                  <div className="col-span-1 text-center space-x-2 flex justify-center items-center">
                    <AddCommentIcon />
                    <p>Comment {post?.comments?.count}</p>
                  </div>
                </div>
                <div className="p-3 border-b-2">
                  <Input
                    className="w-full bg-slate-500 p-3 rounded-2xl relative"
                    placeholder="Comment"
                    disableUnderline
                    endAdornment={
                      <SendIcon
                        className="text-white cursor-pointer"
                        onClick={handleCommentPost}
                      />
                    }
                    onChange={(e) =>
                      setInputComment({
                        ...inputComment,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="bg-slate-500 mt-3 rounded-2xl p-3 overflow-auto h-[600px]">
                  <form onSubmit={handleCommentPost}>
                    {post?.comments?.data && post?.comments?.data.length > 0 ? (
                      post.comments.data.map((comment) => (
                        <Stack
                          key={comment.id}
                          className="bg-slate-700 rounded-2xl p-3 mb-3"
                        >
                          <div className="flex flex-col">
                            <div className="flex row">
                              {comment.users && comment.users.avatar ? (
                                <Avatar
                                  src={
                                    "http://localhost:8000" +
                                    comment.users.avatar
                                  }
                                  className="mx-3"
                                />
                              ) : (
                                <Avatar className="mx-3" />
                              )}
                              <div className="text-[12px] flex justify-center flex-col">
                                <p>{comment.users.name}</p>
                                <p>
                                  {formatDistanceToNow(
                                    new Date(comment.created_at),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </p>
                              </div>
                              {comment.users.username === user?.username && (
                                <CloseIcon
                                  className="ml-auto text-[25px]"
                                />
                              )
                              }
                            </div>
                            <p className="p-3">{comment.content}</p>
                          </div>
                          <div className="flex flex-row border-t-2 py-2 border-neutral-400">
                            <div
                              className="flex items-center flex-row justify-center space-x-2 mx-6 cursor-pointer"
                              onClick={() =>
                                handleLikePost({
                                  status: comment?.likes?.data.find(
                                    (like) => like.user.id === user?.id,
                                  )
                                    ? LikeStatus.DISLIKE
                                    : LikeStatus.LIKE,
                                  comment: comment?.id,
                                })
                              }
                            >
                              {user?.id &&
                              comment?.likes?.data?.some(
                                (info) => info.user.id === user?.id,
                              ) ? (
                                <ThumbUpIcon fontSize="12px" />
                              ) : (
                                <ThumbUpOffAltIcon fontSize="12px" />
                              )}
                              {comment?.likes?.data &&
                              comment?.likes?.data.length > 0 ? (
                                <AvatarGroup max={2} className="mx-2">
                                  {comment?.likes?.data.map((info) => (
                                    <Avatar
                                      key={info.user.id}
                                      alt={info.user.name}
                                      src={
                                        "http://localhost:8000" +
                                        info.user.avatar
                                      }
                                      sx={{ width: 15, height: 15 }}
                                    />
                                  ))}
                                </AvatarGroup>
                              ) : (
                                <></>
                              )}
                              <p className="text-[12px] whitespace-nowrap">
                                Like {comment?.likes?.count}
                              </p>
                            </div>
                            <Input
                              className=" bg-slate-500 text-[12px] p-1 w-full rounded-2xl relative"
                              placeholder="Comment"
                              disableUnderline
                              endAdornment={
                                <SendIcon
                                  className="text-white cursor-pointer"
                                  onClick={handleCommentPost}
                                />
                              }
                              onChange={(e) =>
                                setInputComment({
                                  ...inputComment,
                                  content: e.target.value,
                                  parent: comment.id,
                                })
                              }
                              style={{ fontSize: "12px" }}
                            />
                          </div>
                          <Stack alignItems="flex-end">
                            {comment?.parent.map((parent) => (
                              <div
                                className="flex flex-row border-t-2 py-2 border-neutral-500 items-center w-[95%]"
                                key={parent.id}
                              >
                                <div className="flex row px-2">
                                  {parent.users && parent.users.avatar ? (
                                    <Avatar
                                      src={
                                        "http://localhost:8000" +
                                        parent.users.avatar
                                      }
                                      className="mx-3"
                                      style={{ width: "30px", height: "30px" }}
                                    />
                                  ) : (
                                    <Avatar
                                      className="mx-3"
                                      style={{ width: "30px", height: "30px" }}
                                    />
                                  )}
                                  <div className="text-[12px] flex justify-center flex-col">
                                    <p>{parent.users.name}</p>
                                    <p>
                                      {formatDistanceToNow(
                                        new Date(parent.created_at),
                                        {
                                          addSuffix: true,
                                        },
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-[14px] pl-3 border-l-2 border-neutral-500">
                                  {parent.content}
                                </p>
                              </div>
                            ))}
                          </Stack>
                        </Stack>
                      ))
                    ) : (
                      <></>
                    )}
                  </form>
                </div>
              </div>
            </Stack>
          </div>
        </Stack>
      </Stack>
    );
};
export default Page;

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const INITIAL_VALUES: CreateCommentPayload = {
    content: "",
    posts: 0,
    parent: undefined,
}