import { FC, forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { CONTRACT_STATE } from "@src/Constants";
import { isNil } from "ramda";

interface IContractStateSelectorProps {
    field: ControllerRenderProps<FieldValues, string>;
}

const ContractStateSelector: FC<IContractStateSelectorProps> = ({ field }) => {
    const { value } = field;
    return (<TextField label="ESTADO DE CONTRATO" {...field} value={isNil(value) ? "" : value} select fullWidth>
        <MenuItem value="">TODOS</MenuItem>
        <MenuItem value="active">{CONTRACT_STATE.active}</MenuItem>
        <MenuItem value="expired">{CONTRACT_STATE.expired}</MenuItem>
        <MenuItem value="canceled">{CONTRACT_STATE.canceled}</MenuItem>
    </TextField>);
};

ContractStateSelector.displayName= 'ContractStateSelector';
export default ContractStateSelector;