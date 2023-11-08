import { Dialog, DialogProps, Theme, useMediaQuery } from "@mui/material";

const RspDialog: React.FC<DialogProps> = (dialogProps) => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return <Dialog maxWidth="lg" fullWidth {...dialogProps} fullScreen={isMobile} />
}

export default RspDialog;