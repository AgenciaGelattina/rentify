import { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { TCallBack, useFetchData, useFetchExpress } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues, UseFormSetValue } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import { formatDate, getUIKey } from '@src/Utils';
import DummyTextField from '../DummyTextField';
import { IPaymentData } from '@src/Components/Properties/Contracts/Payments/PaymentForm';
import { DATE_FORMAT } from '@src/Constants';

export interface IRecurringPayments {
    id: number;
    label: string;
}

interface IRecurringPaymentsSelectorProps {
    contract: number;
    paymentDate: Date;
    setValue: (value: number) => void; 
}

const RecurringPaymentsSelector = forwardRef<TextFieldProps, IRecurringPaymentsSelectorProps & ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const { contract, paymentDate, setValue } = props;
    const { fetchData, result, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [recurringData, setRecurringData] = useState<IRecurringPayments[]>([]);

    useEffect(() => {
        console.log('PAYMENT DATE', paymentDate);
        setRecurringData([]);
        fetchData.get('/properties/contracts/payments/recurring/list.php', { contract, date: paymentDate }, (response: TCallBack) => {
            const recurringData = validateResult(response.result);
            console.log(recurringData);
            if (isNotNil(recurringData)) {
                setValue(recurringData[0].id);
                setRecurringData(recurringData);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentDate]);

    if (!loading) {
        return (<TextField id="recurring" label="Pagos Recurrentes" {...props} disabled={isNil(result)} select fullWidth>
            {recurringData.map((rp: IRecurringPayments) => <MenuItem key={getUIKey()} value={rp.id}>{rp.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField />
});

RecurringPaymentsSelector.displayName = 'RecurringPaymentsSelector';
export default RecurringPaymentsSelector;
 