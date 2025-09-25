import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement, Ref } from 'react';

type Props = {
    open:boolean,
    handleClose:()=>void,
    agreeDelete:()=>void,
    isPending:boolean
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({open,handleClose,agreeDelete, isPending}:Props) {
  return (
    <>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>حذف محصول</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            آیا از حذف محصول مطمئن هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='info' sx={{mx:1}} variant='outlined'>خیر</Button>
          <Button onClick={agreeDelete} variant='contained' color='error'>
                {isPending ? <CircularProgress sx={{color:"primary.contrastText"}} size="26px" thickness={5} /> : 'بله'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
