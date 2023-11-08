import { DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

type TRspDialogTitle = {
    title: string;
    onClose: () => void;
}

const RspDialogTitle: React.FC<TRspDialogTitle> = ({ title, onClose }) => {
    return (<DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
    </DialogTitle>);
}

export default RspDialogTitle;