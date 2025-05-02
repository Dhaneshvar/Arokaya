import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ReactMarkdown from "react-markdown";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface CustomizedDialogsProps {
    reportDetails: string;
    setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    openPopup: boolean;
  }
  
  const CustomizedDialogs: React.FC<CustomizedDialogsProps> = ({ reportDetails, setPopupOpen, openPopup}) => {
  const [open, setOpen] = React.useState(openPopup);

  const handleClose = () => {
    setOpen(false);
    setPopupOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Report
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          {/* <CloseIcon /> */}
        </IconButton>
        <DialogContent dividers>
        <div className="markdown-container">
            <ReactMarkdown>{reportDetails}</ReactMarkdown>
        </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default CustomizedDialogs;