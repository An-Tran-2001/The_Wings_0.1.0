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
import { Image as ImageIcon, PersonAdd, InsertEmoticon, WhereToVote, GifBox } from '@mui/icons-material';
import { blue, pink, yellow } from '@mui/material/colors';

const options = ["Public", "Private", "Only me"];
export interface ICreateProps {
  id: string;
  title: string;
  content: string;
}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CreatePost = (props: ICreateProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(options[0]);
  const [inputValue, setInputValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { id, title } = props;

  return (
    <div className="flex p-3 bg-neutral-900 rounded-lg">
      <Avatar className="bg-blue-400 w-[50px] h-[50px] rounded-full mx-2" />
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
        <DialogContent dividers className="">
          <Typography className="flex">
            <Avatar className="bg-blue-400 w-[70px] h-[70px] rounded-full mx-3" />
            <div>
              <span className="font-bold px-2 text-[1.1rem]">User name</span>
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
          <Stack direction="row" className="p-2 border-solid border border-stone-500 rounded-lg">
            <Button className="mr-20 text-white">Add to your article</Button>
            <IconButton>
              <ImageIcon color="success"/>
            </IconButton>
            <IconButton>
              <PersonAdd sx={{ color: blue[500] }}/>
            </IconButton>
            <IconButton>
              <InsertEmoticon sx={{ color: yellow[500] }}/>
            </IconButton> 
            <IconButton>
              <WhereToVote sx={{ color: pink[500] }}/>
            </IconButton> 
            <IconButton>
              <GifBox color="action"/>
            </IconButton> 
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
    </div>
  );
};

export default memo(CreatePost);
