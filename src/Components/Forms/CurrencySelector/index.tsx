import { forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { CURRENCY } from "@src/Constants";

export type ICurrency = "mxn" | "usd";

const CurrencySelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    return (<TextField label="TIPO DE MONEDA" {...props} select fullWidth>
        <MenuItem value="mxn">{CURRENCY.mxn.text}</MenuItem>
        <MenuItem value="usd">{CURRENCY.usd.text}</MenuItem>
    </TextField>);
});
CurrencySelector.displayName= 'CurrencySelector';
export default CurrencySelector;