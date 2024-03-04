import { forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

const PaymentTypeSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const { value } = props;

    return (<TextField label="TIPO DE PAGO" {...props} helperText={
        value === 1 ? "El pago se contabilizará en el cálculo de la renta." : "El pago NO se contabilizará en el cálculo de la renta."
    } select fullWidth>
        <MenuItem value={1}>Renta</MenuItem>
        <MenuItem value={2}>Otro</MenuItem>
    </TextField>);
});
PaymentTypeSelector.displayName= 'PaymentTypeSelector';
export default PaymentTypeSelector;