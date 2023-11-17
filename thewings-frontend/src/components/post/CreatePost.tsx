import { Avatar } from "@mui/material";
import { memo, useEffect } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import {
  Image as ImageIcon,
  PersonAdd,
  InsertEmoticon,
  WhereToVote,
  GifBox,
} from "@mui/icons-material";
import { blue, pink, yellow } from "@mui/material/colors";
import { User, useAuth } from "store/auth";
import Image from "next/image";
import Search from "components/layout/Header/Search";
import { usePost } from "store/post/selector";
import { PostStatus } from "constant/enum";
export interface Credentials {
  content: string;
  status: string;
  files: File[];
  tags: number[];
}


// Simple dialog
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Tags Users</DialogTitle>
      <List sx={{ p: 2 }} className="h-[380px] w-[500px] overflow-hidden">
        <Search onClick={handleListItemClick} />
      </List>
    </Dialog>
  );
}

//  Bosstrap dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Status {
  onPosts: () => void;
}
const CreatePost = (props: Status) => {
  const { onPosts} = props;
  const { onCreatePost } = usePost();
  const [creds, setCreds] = React.useState<Credentials>(INITIAL_VALUES);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(PostStatus.PUBLIC);
  const [inputValue, setInputValue] = React.useState("");
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = React.useState(null);
  const [isError, setIsError] = React.useState<string>("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openTags, setOpenTags] = React.useState(false);
  const [selectedValueTags, setSelectedValueTags] = React.useState<User[]>([]);

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
    console.log(files);
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
      creds.status = status;
      console.log(creds);
      await onCreatePost(creds);
      setOpen(false);
      await onPosts();
    } catch (error) {
      setIsError("Error Not Content");
    }
  };

  return (
    <div className="flex p-3 bg-neutral-900 rounded-lg">
      {user?.avatar ? (
        <Image
          src={"http://localhost:8000" + user?.avatar}
          alt={user.name}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "50%", height: "100%" }}
          className="max-w-[60px] max-h-[60px]"
        />
      ) : (
        <Avatar sx={{ width: 40, height: 40 }} className="absolute inset-0" />
      )}
      <Button
        className="text-gray-300 font-normal w-full px-3 py-2 rounded-3xl  bg-gray-800"
        onClick={handleClickOpen}
      >
        What&apos;s on your mind?
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="text-center font-bold border-b-1"
        >
          Create post
        </DialogTitle>
        <IconButton
          className="bg-gray-500 text-white"
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography className="flex">
            {user?.avatar ? (
              <Image
                src={"http://localhost:8000" + user?.avatar}
                alt={user.name}
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
              <span className="font-bold px-2 text-[1.1rem]">{user?.name}</span>
              <Autocomplete
                value={status}
                onChange={(event: any, newValue: string | null) => {
                  setStatus(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                size="small"
                id="controllable-states-demo"
                options={[
                  PostStatus.PUBLIC,
                  PostStatus.PRIVATE,
                  PostStatus.PRIVATE_ONLY,
                ]}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="State" />
                )}
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
              className="w-full m-3 border-none"
              onChange={(event) => {
                setCreds((prev) => ({ ...prev, content: event.target.value }));
              }}
            />
            <p className="text-red-500 text-center mt-2">{isError}</p>
          </Typography>
          {selectedValueTags.length > 0 && (
            <div className="flex flex-row py-3">
              <IconButton>
                <SupervisedUserCircleIcon sx={{ color: yellow[500] }} />
              </IconButton>
              {selectedValueTags.map((user) => (
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
          {imagePreview &&
            imagePreview.length > 0 &&
            imagePreview.map((imagePreview) => (
              <Typography gutterBottom>
                {" "}
                <img src={imagePreview} alt="preview" />{" "}
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
        <DialogActions className="flex justify-center px-4">
          <Button
            variant="contained"
            onClick={onSubmit}
            className="w-full text-white px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Post
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <SimpleDialog
        selectedValue={selectedValueTags}
        open={openTags}
        onClose={handleCloseTags}
      />
    </div>
  );
};

export default memo(CreatePost);
const INITIAL_VALUES = {
  content: "",
  status: "",
  files: [],
  tags: [],
};