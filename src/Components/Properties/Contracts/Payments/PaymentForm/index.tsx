import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Button, DialogActions, DialogContent, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { fieldError, getUIKey } from '@src/Utils';
import { useEffect } from 'react';
import { isNil, isNotNil } from 'ramda';
import TextFieldMoney from '@src/Components/Forms/TextFieldMoney';
import { DatePicker } from '@mui/x-date-pickers';
import PaymentTypeSelector from '@src/Components/Forms/PaymentType';
import { IPayment } from '..';

export interface IPaymentData {
    id: number;
    contract: number;
    type: number;
    amount: number;
    date: Date | null;
    clarifications: string;
}

export type TPaymentForm = {
    payment?: IPayment;
    contract_id: number;
    open: boolean;
}

interface IPaymentFormProps {
    setOpen: (payment: TPaymentForm) => void;
    getPayments: () => void;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    type: yup.number().required(),
    amount: yup.number().min(1),
    date: yup.date().nullable(),
    clarifications: yup.string(),
});

const defaultPaymentData = (contract_id: number): IPaymentData => {
    return {
        id: 0,
        contract: contract_id,
        type: 1,
        amount: 0,
        date: new Date(),
        clarifications: ""
    }
}

const PaymentForm: React.FC<IPaymentFormProps & TPaymentForm> = ({ payment, contract_id, open, setOpen, getPayments }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, setValue, formState: { errors }, reset } = useForm({ defaultValues: defaultPaymentData(contract_id), resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (open) {
            if (isNotNil(payment)) {
                const { type, date, ...rest } = payment;
                const paymentData: IPaymentData = {
                    ...rest,
                    type: type.id,
                    date: new Date(payment.date || ""),
                    contract: contract_id
                };
                reset(paymentData);
            }
        }
        return () => {
            reset(defaultPaymentData(contract_id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract_id, payment, setValue, reset]);

    const closePaymentForm = () => {
        setOpen({ open: false, contract_id })
    }

    const onFormSubmit = (data: FieldValues) => {
        const { date } = data;
        console.log(date)
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
        <RspDialogTitle title={isNil(payment) ?  'NUEVO PAGO' :  'EDITAR PAGO'} onClose={closePaymentForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} md={6}>
                    <Controller name="amount" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Pago" {...fieldError(errors.amount)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                
                <Grid xs={12} md={6}>
                    <Controller name="date" control={control} render={({ field }) => {
                        return <DatePicker label="Fecha de pago" {...field} format="dd/MM/yyyy" onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="type" control={control} render={({ field }) => {
                        return <PaymentTypeSelector {...field} onChange={(e) => field.onChange(e)}  />
                    }} />
                </Grid>
                <Grid xs={12}>
                    <Controller name="clarifications" control={control} render={({ field }) => {
                        return <TextField id="clarifications" label="Aclaraciones" multiline maxRows={4} type="text" {...field} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
        </DialogContent>
        <DialogActions>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>) 

}

export default PaymentForm;