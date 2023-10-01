import { Avatar } from "@mui/material";
import { memo } from "react";
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

// Simple dialog
const emails = ["username@gmail.com", "user02@gmail.com"];
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
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
      <List sx={{ pt: 0 }}>
        <Search onClick={handleListItemClick} />
      </List>
    </Dialog>
  );
}

//  Bosstrap dialog
const options = ["Public", "Private", "Only me"];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CreatePost = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(options[0]);
  const [inputValue, setInputValue] = React.useState("");
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
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
    const file = event.target.files[0];
    setSelectedFile(file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };
  console.log(selectedFile);
  return (
    <div className="flex p-3 bg-neutral-900 rounded-lg">
      {user?.avatar ? (
        <Image
          src={"http://localhost:8000" + user?.avatar}
          alt={user.name}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "50%", height: "100%" }}
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
                value={value}
                onChange={(event: any, newValue: string | null) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                size="small"
                id="controllable-states-demo"
                options={options}
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
              className="w-full h-[100px] border-none"
            />
          </Typography>
          <div className="flex flex-row py-3">
            <IconButton>
              <SupervisedUserCircleIcon sx={{ color: yellow[500] }} />
            </IconButton>
            {selectedValueTags.length > 0 &&
              selectedValueTags.map((user) => (
                <div className="flex flex-row justify-center items-center">
                  <Avatar
                    src={"http://localhost:8000" + user.avatar}
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  />
                  <span className="px-2">{user.name}</span>
                </div>
              ))}
          </div>
          {imagePreview && (
            <Typography gutterBottom>
              {" "}
              <img src={imagePreview} alt="preview" />{" "}
            </Typography>
          )}
          <Stack
            direction="row"
            className="p-2 justify-between border-solid border border-stone-500 rounded-lg"
          >
            <Button className="mr-20 text-white">Add to your article</Button>
            <Stack direction="row">
              <input
                type="file"
                id="upload-file"
                style={{ position: "absolute", top: "-9999px" }}
                onChange={handleFileChange}
              />
              <IconButton component="label" htmlFor="upload-file">
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
            onClick={handleClose}
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
