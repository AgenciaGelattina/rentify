import { forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

const PaymentTypeSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
   
    return (<TextField id="status" label="TYPO DE PAGO" {...props} select fullWidth>
        <MenuItem value={1}>Mensual</MenuItem>
        <MenuItem value={2}>Anual</MenuItem>
        <MenuItem value={3}>Otro</MenuItem>
    </TextField>);
});
PaymentTypeSelector.displayName= 'PaymentTypeSelector';
export default PaymentTypeSelector;