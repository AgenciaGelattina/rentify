import { Alert, AlertColor } from "@mui/material";
import { Check } from '@mui/icons-material';
import { FC, ReactNode } from "react";

export interface ILabelStatus {
    label: string;
    severity: AlertColor;
    action?: ReactNode;
}

const LabelStatus: FC<ILabelStatus> = ({ label, severity, action }) => {
    return (<Alert
            severity={severity}
            action={action}
            sx={{
                alignItems: 'center',
                '& .MuiAlert-icon': {
                    padding: 0
                },
                '& .MuiAlert-message': {
                    padding: 0,
                    paddingTop: '.1rem',
                    fontWeight: 600
                }
            }}
        >
            {label}
    </Alert>);
}

export default LabelStatus;