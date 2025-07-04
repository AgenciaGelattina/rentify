import { Alert, Button } from "@mui/material";
import { FC } from "react";

interface IConfirmationAlertProps {
    isConfirmed: boolean;
    isEdition: boolean;
    isAdmin?: boolean;
    setPaymentConfirmation: () => void;
}

const ConfirmationAlert: FC<IConfirmationAlertProps> = ({ isConfirmed, isEdition, isAdmin = false, setPaymentConfirmation }) => {

    return (<Alert severity={isConfirmed ? "success" : "warning"}  action={
                (isAdmin && isEdition) && (<Button color="inherit" size="small" onClick={setPaymentConfirmation}>
                    {isConfirmed ? "DESCONFIRMAR" : "CONFIRMAR"}
                </Button>)
            }>
                {isEdition && `Este pago esta ${isConfirmed ? "confirmado" : "sin confirmar"}.`}
                {!isEdition && `Este pago se guardará ${isAdmin ? "confirmado" : "sin confirmar"}.`}
    </Alert>);
};

export default ConfirmationAlert;