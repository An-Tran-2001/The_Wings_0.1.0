import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Pic } from 'store/mypics/reducer';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogImagesProps {
    name_button: string;
    images: Pic[];
}

export default function DialogImagesSlide({name_button, images}: DialogImagesProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} size="small" style={{ color: "#fff"}}>
        {name_button}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle>{"Images"}</DialogTitle>
        <DialogContent dividers>
          <ImageList variant="masonry" cols={3} gap={8}>
            {images.map((item) => (
              <ImageListItem key={item.id}>
                <img
                  srcSet={`${item.file}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.file}?w=248&fit=crop&auto=format`}
                  alt={item.name}
                  loading="lazy"
                  className="rounded-2xl"
                />
                <ImageListItemBar position="below" title={item.name} />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}