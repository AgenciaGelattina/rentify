import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConditionalRender, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Button, DialogActions, DialogContent, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { fieldError, getUIKey } from '@src/Utils';
import { useEffect } from 'react';
import { isNil, isNotNil } from 'ramda';
import TextFieldMoney from '@src/Components/Forms/TextFieldMoney';
import PaymentTypeSelector from '@src/Components/Forms/PaymentType';
import { IPayment } from '..';
import { DatePicker } from '@mui/x-date-pickers';
import RecurringPaymentsSelector from '@src/Components/Forms/RecurringPayments';
import { IContract } from '../../Details';

export interface IPaymentData {
    id: number;
    contract: number;
    recurring: number;
    type: number;
    amount: number;
    date: Date;
    clarifications: string;
}

export type TPaymentForm = {
    contract: IContract;
    payment_date: Date;
    open: boolean;
    payment?: IPayment;
}

interface IPaymentFormProps {
    setOpen: (payment: TPaymentForm) => void;
    getPayments: () => void;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    recurring: yup.number(),
    type: yup.number().required(),
    amount: yup.number().min(1),
    date: yup.date(),
    clarifications: yup.string(),
});

const defaultPaymentData = (contract: IContract, payment_date: Date = new Date): IPaymentData => {
    return {
        id: 0,
        contract: contract.id,
        recurring: 0,
        type: 1,
        amount: 0,
        date: payment_date,
        clarifications: ""
    }
}

const PaymentForm: React.FC<IPaymentFormProps & TPaymentForm> = ({ payment, contract, payment_date, open, setOpen, getPayments }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, setValue, formState: { errors }, reset } = useForm({ defaultValues: defaultPaymentData(contract, payment_date), resolver: yupResolver(formValidations) });
    //const { isDirty } = useFormState({ control });
    const paymentDate = watch('date');
    const paymentType = watch('type');

    useEffect(() => {
        if (open) {
            if (isNotNil(payment)) {
                const { type, recurring, date, ...rest } = payment;
                const paymentData: IPaymentData = {
                    ...rest,
                    recurring: recurring.id,
                    type: type.id,
                    date: new Date(payment.date || ""),
                    contract: contract.id
                };
                reset(paymentData);
            }
        }
        return () => {
            reset(defaultPaymentData(contract));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract, payment, setValue, reset]);

    const closePaymentForm = () => {
        setOpen({ open: false, contract, payment_date: new Date })
    }

    const onFormSubmit = (data: FieldValues) => {
        const { date } = data;
        if (isNil(date)) {
            setError('date', { type: "error", message: "Seleccione una fecha de pago." });
            return false;
        }
        fetchData.post('/properties/contracts/payments/payment.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                getPayments();
                closePaymentForm();
            }
        });
    }
    
    return (<RspDialog open={open} maxWidth="sm" onClose={closePaymentForm} >
        <RspDialogTitle title={isNil(payment) ?  'REGISTRIAR PAGO' :  'EDITAR PAGO'} onClose={closePaymentForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} md={6}>
                    <Controller name="amount" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Pago" {...fieldError(errors.amount)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="date" control={control} render={({ field }) => {
                        return <DatePicker
                            label="Fecha de pago" {...field}
                            format="dd/MM/yyyy"
                            minDate={new Date(contract.start_date || "")}
                            maxDate={new Date(contract.end_date || "")}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                        />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="type" control={control} render={({ field }) => {
                        return <PaymentTypeSelector {...field} onChange={(e) => {
                            field.onChange(e);
                            const { target } = e;
                            if(target.value > 1) {
                                setValue('recurring', 0);
                            }
                            
                        }} />
                    }} />
                </Grid>
                <ConditionalRender condition={paymentType === 1}>
                    <Grid xs={12} md={6}>
                        <Controller name="recurring" control={control} render={({ field }) => {
                            return <RecurringPaymentsSelector {...field} paymentDate={paymentDate || new Date} setValue={(defaultValue: number) => setValue('recurring', defaultValue)} contract={contract.id} onChange={(e) => field.onChange(e)} />
                        }} />
                    </Grid>
                </ConditionalRender>
                <Grid xs={12}>
                    <Controller name="clarifications" control={control} render={({ field }) => {
                        return <TextField {...field} label="Aclaraciones" multiline maxRows={4} type="text" onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>) 

}

export default PaymentForm;