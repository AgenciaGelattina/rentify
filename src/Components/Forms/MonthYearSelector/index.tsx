import { FC } from "react";
import { MenuItem, TextField } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil } from "ramda";
import { DatePicker } from "@mui/x-date-pickers";

interface IMonthYearSelectorProps {
    field: ControllerRenderProps<FieldValues, string>;
}

const MonthYearSelector: FC<IMonthYearSelectorProps> = ({ field }) => {
    return (<DatePicker label="Periodo de Cobranza" {...field} views={['month', 'year']} yearsOrder="desc" />);
};
MonthYearSelector.displayName= 'MonthYearSelector';
export default MonthYearSelector;