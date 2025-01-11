import { DialogContent, Typography } from '@mui/material';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { Dispatch, FC, SetStateAction } from 'react';

export type TClarificationsModal = {
    clarification: string;
    open: boolean;
}

type TClarificationsModalProps = {
    onClose: Dispatch<SetStateAction<TClarificationsModal>>;
}

export const descriptionModalDefault: TClarificationsModal = { open: false, clarification: "" };

const ClarificationsModal: FC<TClarificationsModal & TClarificationsModalProps> = ({ clarification, open, onClose }) => {

    return (<RspDialog open={open} maxWidth="sm" onClose={() => onClose(descriptionModalDefault)} >
        <RspDialogTitle title="" onClose={() => onClose(descriptionModalDefault)} />
        <DialogContent>
            <Typography >{clarification}</Typography>
        </DialogContent>
    </RspDialog>)

}

export default ClarificationsModal; 