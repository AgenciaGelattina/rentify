import { forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

const PaymentsStatuSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    return (<TextField label="ESTADO DE PAGOS" {...props} select fullWidth>
        <MenuItem value={0}>TODAS</MenuItem>
        <MenuItem value={1}>CON ADEUDO</MenuItem>
        <MenuItem value={2}>SIN ADEUDO</MenuItem>
    </TextField>);
});
PaymentsStatuSelector.displayName= 'PaymentsStatuSelector';
export default PaymentsStatuSelector;