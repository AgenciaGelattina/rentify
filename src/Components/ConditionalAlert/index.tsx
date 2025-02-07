import { Alert, AlertColor, AlertTitle } from '@mui/material';

type TConditionalAlert = {
    condition: boolean;
    severity: AlertColor;
    title: string;
    message?: string;
}

const ConditionalAlert: React.FC<TConditionalAlert> = ({ condition, severity, title, message }) => {
    return (<>
        {condition && (<Alert severity={severity}>
            <AlertTitle>{title}</AlertTitle>
            {message && message}
        </Alert>)} 
    </>);
}

export default ConditionalAlert;