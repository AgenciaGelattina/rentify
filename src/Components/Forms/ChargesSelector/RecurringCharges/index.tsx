import { FC, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { TCallBack, useFetchData, useFetchExpress } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues, UseFormSetValue } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import DummyTextField from '../../DummyTextField';

export interface IRecurringCharges {
    id: number;
    label: string;
}

interface IRecurringChargesSelectorProps extends ControllerRenderProps<FieldValues, string> {
    contract: number;
    paymentDate: Date;
    setValue: (value: number) => void; 
}

//const RecurringChargesSelector = forwardRef<TextFieldProps, IRecurringChargesSelectorProps & ControllerRenderProps<FieldValues, string>>((props, ref) => {
const RecurringChargesSelector: FC<IRecurringChargesSelectorProps> = (props) => {
    const { contract, paymentDate, setValue, name, value, onChange, onBlur } = props;
    const { fetchData, result, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [recurringData, setRecurringData] = useState<IRecurringCharges[]>([]);

    useEffect(() => {
        //setRecurringData([]);
        fetchData.get('/properties/contracts/charges/recurring/list.php', { contract, date: paymentDate }, (response: TCallBack) => {
            const recurringData = validateResult(response.result);
            if (isNotNil(recurringData)) {
                if (value === 0) {
                    setValue(recurringData[0].id);
                }
                setRecurringData(recurringData);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentDate]);

    if (!loading && value > 0 && recurringData.length > 0) {
        return (<TextField id={name} name={name} label="Cargo a Pagar" onChange={(e)=> onChange(e)} value={value} onBlur={onBlur} disabled={isNil(result)} select fullWidth>
            {recurringData.map((rp: IRecurringCharges) => <MenuItem key={`rp${rp.id}`} value={rp.id}>{rp.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField />;
};

RecurringChargesSelector.displayName = 'RecurringChargesSelector';
export default RecurringChargesSelector;