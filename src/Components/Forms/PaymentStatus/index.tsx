import { FC } from "react";
import { MenuItem, TextField } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil } from "ramda";

interface IPaymentsStatuSelectorProps {
    field: ControllerRenderProps<FieldValues, string>;
}

const PaymentsStatuSelector: FC<IPaymentsStatuSelectorProps> = ({ field }) => {
    const { value } = field;
    return (<TextField defaultValue={0} label="ESTADO DE PAGOS" {...field} value={isNil(value) ? 0 : value} select fullWidth>
        <MenuItem value={0}>TODAS</MenuItem>
        <MenuItem value={1}>CON ADEUDO</MenuItem>
        <MenuItem value={2}>SIN ADEUDO</MenuItem>
    </TextField>);
};
PaymentsStatuSelector.displayName= 'PaymentsStatuSelector';
export default PaymentsStatuSelector;