import { forwardRef, useEffect, useState } from "react";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil, isNotNil } from "ramda";
import { getDaysInMonth } from 'date-fns';
import DummyTextField from "../DummyTextField";

export interface IDueDateOption {
    value: number;
    text: string;
}

interface IDueDateProps {
    startDate: Date | null;
}

const DueDateSelector = forwardRef<TextFieldProps, IDueDateProps & ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const { startDate } = props;
    const [dueDatesList, setDueDatesList] = useState<IDueDateOption[]>([]);

    useEffect(() => {
        const dueDates = [
            { value: 1, text: "Día 1 (Inicio de Mes)" },
            { value: 15, text: "Día 15 (Mitad de Mes)" }
        ];
        if (isNotNil(startDate)) { 
            const numsOfDays = getDaysInMonth(startDate);
            for (let i = 1; i <= numsOfDays; i++) {
                if (i !== 1 && i !== 15) {
                    dueDates.push({ value: i, text: `Día ${i}`});
                }
            }
        }
        setDueDatesList(dueDates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate])

    if (dueDatesList.length > 0) {
        return (<TextField id="due_date" label="Día de Corte" {...props} disabled={isNil(startDate)} select fullWidth>
            {dueDatesList.map((dd => {
                return <MenuItem key={`d${dd.value}`} value={dd.value}>{dd.text}</MenuItem>;
            }))}
        </TextField>);
    }
    return <DummyTextField label="Dia de Corte" />;
});
DueDateSelector.displayName= 'DueDateSelector';
export default DueDateSelector;