import { FC, forwardRef, ReactNode, useMemo } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { PAYMENT_TYPE } from "@src/Constants";
import { TPaymentType } from "@src/Components/Properties/Contracts/Payments";

interface IPaymentTypeSelectorProps {
    paymentTypes: TPaymentType[];
}

const PaymentTypeSelector: FC<IPaymentTypeSelectorProps & TextFieldProps> = (props) => {
    const { id, value, paymentTypes , onChange } = props;

    return (<TextField id={id} label="Tipo de Pago" onChange={onChange} value={value} select fullWidth>
        {paymentTypes.map((pt: TPaymentType) => {
            return <MenuItem key={pt} value={pt}>{PAYMENT_TYPE[pt]}</MenuItem> 
        })}
    </TextField>);
};

PaymentTypeSelector.displayName = 'PaymentTypeSelector';
export default PaymentTypeSelector;