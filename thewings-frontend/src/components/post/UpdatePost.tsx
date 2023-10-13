import { Autocomplete, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { PostStatus } from "constant/enum";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { Post } from "store/post/reducer"
import { Credentials, SimpleDialog } from "./CreatePost";
import {
  Image as ImageIcon,
  PersonAdd,
  InsertEmoticon,
  WhereToVote,
  GifBox,
} from "@mui/icons-material";
import { blue, yellow } from "@mui/material/colors";
import SimpleDialogDemo from "./Tag";
import { User } from "store/auth";
import { usePost } from "store/post/selector";

const UpdatePost = ({
  post,
  onOpen,
  handleClose,
}: {
  post: Post;
  onOpen: boolean;
  handleClose: () => void;
}) => {
    const {onUpdatePost} = usePost();
    const [creds, setCreds] = useState<Credentials>(INITIAL_VALUES);
    const [imagePreview, setImagePreview] = useState(null);
    const [openTags, setOpenTags] = useState(false);
    const [selectedValueTags, setSelectedValueTags] = useState<User[]>(
      [],
    );
    const [isError, setIsError] = useState("");

    const handleClickOpenTags = () => {
      setOpenTags(true);
    };

    const handleCloseTags = (user: User) => {
      setOpenTags(false);
      setSelectedValueTags((prevTags: User[]) => [...prevTags, user]);
    };
    const handleFileChange = (event) => {
      const files = event.target.files;
      setCreds((prev) => ({ ...prev, files: files }));
      const previewURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setImagePreview(previewURLs);
    };
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const userIds = selectedValueTags.map((user) => Number(user.id));
        creds.tags = userIds;
        await onUpdatePost({id: post.id, ...creds});
        handleClose();
      } catch (error) {
        setIsError("Error Not Content");
      }
    };
    useEffect(() => {
        setCreds((prev) => ({ ...prev, content: post.content }));
        }, [post.content]);
  return (
    <Dialog open={onOpen} onClose={handleClose}>
      <DialogTitle>Change Post</DialogTitle>
      <DialogContent dividers>
        <Typography className="flex">
          {post.author?.avatar ? (
            <Image
              src={"http://localhost:8000" + post.author?.avatar}
              alt={post.author?.name}
              width={70}
              height={70}
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                height: "100%",
                marginRight: "10px",
              }}
            />
          ) : (
            <Avatar
              sx={{ width: 40, height: 40 }}
              className="absolute inset-0"
            />
          )}
          <div>
            <span className="font-bold px-2 text-[1.1rem]">
              {post.author?.name}
            </span>
            <Autocomplete
              value={post.status}
              onChange={(event: any, newValue: string | null) => {
                setCreds((prev) => ({ ...prev, status: newValue }));
              }}
              size="small"
              id="controllable-states-demo"
              options={[
                PostStatus.PUBLIC,
                PostStatus.PRIVATE,
                PostStatus.PRIVATE_ONLY,
              ]}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="State" />}
            />
          </div>
        </Typography>
        <Typography gutterBottom>
          <TextField
            id="standard-multiline-flexible"
            label="What are you thinking ?"
            multiline
            maxRows={8}
            variant="standard"
            value={creds.content}
            onChange={(event: any) => { setCreds((prev) => ({ ...prev, content: event.target.value })); }}
            className="w-full m-3 border-none"
          />
          <p className="text-red-500 text-center mt-2">{isError}</p>
        </Typography>
        {post.tags?.data.length > 0 && (
          <div className="flex flex-row py-3">
            <IconButton>
              <SupervisedUserCircleIcon sx={{ color: yellow[500] }} />
            </IconButton>
            {post.tags?.data.map((user) => (
              <div
                className="flex flex-row justify-center items-center"
                key={user.id}
              >
                <Avatar
                  src={"http://localhost:8000" + user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
                <span className="px-2">{user.name}</span>
              </div>
            ))}
          </div>
        )}
        {imagePreview && imagePreview.length > 0
          ? imagePreview.map((imagePreview) => (
              <Typography gutterBottom key={imagePreview}>
                {" "}
                <img src={imagePreview} alt="preview" />{" "}
              </Typography>
            ))
          : post.files?.data.length > 0 &&
            post.files?.data.map((file) => (
              <Typography gutterBottom key={file.id}>
                {" "}
                <img src={file.file} alt={file.name} />{" "}
              </Typography>
            ))}
        <Stack
          direction="row"
          className="p-2 justify-between border-solid border border-stone-500 rounded-lg"
        >
          <Button className="mr-20 text-white">Add to your article</Button>
          <Stack direction="row">
            <input
              type="file"
              multiple
              id="upload-file-post"
              style={{ position: "absolute", top: "-9999px" }}
              onChange={handleFileChange}
            />
            <IconButton component="label" htmlFor="upload-file-post">
              <ImageIcon color="success" />
            </IconButton>
            <IconButton>
              <PersonAdd
                sx={{ color: blue[500] }}
                onClick={handleClickOpenTags}
              />
            </IconButton>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>Update</Button>
      </DialogActions>
      <SimpleDialog
        selectedValue={selectedValueTags}
        open={openTags}
        onClose={handleCloseTags}
      />
    </Dialog>
  );
};
export default memo(UpdatePost)
const INITIAL_VALUES = {
    content: "",
    status: PostStatus.PUBLIC,
    tags: [],
    files: [],
    };