import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";


export interface IAlertModalProps {
  open: boolean;
  message?: string;
  onConfirmation?: () => void;
  closeModal?: () => void;
}

const AlertModal = ({
  open,
  message = "",
  closeModal,
  onConfirmation
}: IAlertModalProps) => {

    const handleClose = () => {
        if (closeModal) {
        closeModal();
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={handleClose}>
                NO
            </Button>
            <Button color="error" onClick={() => {
                if(onConfirmation) {
                    onConfirmation();
                }
            }}>
            SI
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default AlertModal;
