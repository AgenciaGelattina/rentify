import { FC, forwardRef } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { CONTRACT_TYPE } from "@src/Constants";
import { isNil } from "ramda";

interface IContractTypeSelectorProps {
    field: ControllerRenderProps<FieldValues, string>;
}

const ContractTypeSelector: FC<IContractTypeSelectorProps> = ({ field }) => {
    const { value } = field;
    return (<TextField label="TIPO DE CONTRATO" {...field} value={isNil(value) ? "" : value} select fullWidth>
        <MenuItem value="">TODOS</MenuItem>
        <MenuItem value="recurring">{CONTRACT_TYPE.recurring}</MenuItem>
        <MenuItem value="express">{CONTRACT_TYPE.express}</MenuItem>
    </TextField>);
};

ContractTypeSelector.displayName= 'ContractTypeSelector';
export default ContractTypeSelector;