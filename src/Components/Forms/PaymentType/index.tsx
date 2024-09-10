import { forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

const PaymentTypeSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    return (<TextField label="TIPO DE PAGO" {...props} select fullWidth>
        <MenuItem value={1}>Pago Recurrente</MenuItem>
        <MenuItem value={2}>Pago Único</MenuItem>
    </TextField>);
});
PaymentTypeSelector.displayName= 'PaymentTypeSelector';
export default PaymentTypeSelector;