import { FC, useContext, useEffect, useState } from "react";
import { IContract } from "@src/Components/Properties/Contracts/Details";
import { IPayment, TPaymentType } from "../..";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { Controller, FieldValues, useForm } from "react-hook-form";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import { clone, isNil, isNotNil } from "ramda";
import { Alert, Box, Button, DialogActions, DialogContent, Divider, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import { fieldError, formatDate, showOnRoles } from "@src/Utils";
import { DatePicker } from "@mui/x-date-pickers";
import PaymentTypeSelector from "@src/Components/Forms/PaymentType";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import RecurringChargesSelector from "@src/Components/Forms/ChargesSelector/RecurringCharges";
import { StoreContext } from "@src/DataProvider";
import ConfirmationAlert from "../../ConfirmationAlert/indext";

export interface IRecurringPaymentData {
    id: number;
    contract: number;
    recurring: number;
    amount: number;
    date: Date;
    clarifications: string;
}

export interface IRecurringPaymentForm {
    open: boolean;
    payment?: IPayment;
};

interface IRecurringPaymentFormProps extends IRecurringPaymentForm {
    contract: IContract;
    setOpen: (paymentFormData: IRecurringPaymentForm) => void;
    getPayments: () => void;
};

export const recurringPaymentFormDefault: IRecurringPaymentForm = { open: false };

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    recurring: yup.number(),
    amount: yup.number().min(1),
    date: yup.date(),
    clarifications: yup.string(),
});

const defaultRecurringPaymentData = (contract: IContract, payment?: IPayment): IRecurringPaymentData => {
    return {
        id: 0,
        contract: contract.id,
        recurring: 0,
        amount: 0,
        date: isNotNil(payment) ? payment.date : new Date(),
        clarifications: ""
    }
}

const RecurringPaymentForm:  FC<IRecurringPaymentFormProps> = ({ payment, open, contract, setOpen, getPayments }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, setValue, formState: { errors }, reset } = useForm({ defaultValues: defaultRecurringPaymentData(contract, payment), resolver: yupResolver(formValidations) });
    const [paymentType, setPaymentType] = useState<TPaymentType>("monthly");
    //const { isDirty } = useFormState({ control });
    const paymentDate = watch('date');

    const closePaymentForm = () => {
        setOpen(recurringPaymentFormDefault);
    };

    useEffect(() => {
        if (open) {
            if (isNotNil(payment)) {
                const { type, recurring, date, ...rest } = payment;
                setPaymentType(type);
                const paymentData: IRecurringPaymentData = {
                    ...rest,
                    recurring: recurring ? recurring.id : 0,
                    date: new Date(payment.date || ""),
                    contract: contract.id
                };
                reset(paymentData);
            }
        }
        return () => {
            setPaymentType("monthly");
            reset(defaultRecurringPaymentData(contract));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract, payment, reset]);

    const onFormSubmit = (data: FieldValues) => {
        const { date } = clone(data);

        if (isNil(date)) {
            setError('date', { type: "error", message: "Seleccione una fecha de pago." });
            return false;
        }

        //fix date format
        data.date = formatDate(date);

        //role data
        data.confirmed = showOnRoles(user, [1,2]) ? 1 : 0;

        fetchData.post('/properties/contracts/payments/recurring/payment.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                getPayments();
                closePaymentForm();
            }
        });
    };

    const isEdition = (isNotNil(payment) && (payment.id > 0)) || false;
    const isConfirmed = isEdition && (isNotNil(payment) && payment.confirmed) || false;
    const dialogLabel = isEdition ?  'EDITAR PAGO' : 'REGISTRAR PAGO';

    const setPaymentConfirmation = () => {
        if (isNotNil(payment)) {
            fetchData.post('/properties/contracts/payments/confirm.php', { payment_id: payment.id, contract_id: contract.id, confirmed: isConfirmed ? 0 : 1 }, (response: TCallBack) => {
                const confirmed = validateResult(response.result);
                if (confirmed) {
                    getPayments();
                    closePaymentForm();
                }
            });
        }
    };

    const setDeletePayment = () => {
        if (isNotNil(payment)) {
            fetchData.delete('/properties/contracts/payments/recurring/payment.php', { payment_id: payment.id, contract_id: contract.id }, (response: TCallBack) => {
                const deleted = validateResult(response.result);
                if (deleted) {
                    getPayments();
                    closePaymentForm();
                }
            });
        }
    };

    return (<RspDialog open={open} maxWidth="sm" onClose={closePaymentForm} >
        <RspDialogTitle title={dialogLabel} onClose={closePaymentForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="amount" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Pago" {...fieldError(errors.amount)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="date" control={control} render={({ field }) => {
                        return <DatePicker
                            label="Fecha de pago" {...field}
                            format="dd/MM/yyyy"
                            minDate={new Date(contract.start_date || "")}
                            maxDate={new Date("now")}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                        />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PaymentTypeSelector
                        id="paymentType"
                        value={paymentType}
                        paymentTypes={["monthly", "extraordinary"]}
                        onChange={(e) => {
                            const { target } = e;
                            const type = target.value as TPaymentType;
                            setPaymentType(type);
                            if(type === "extraordinary") {
                                setValue('recurring', 0);
                            }
                        }}
                    />
                </Grid>
                {paymentType === "monthly" && (<Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="recurring" control={control} render={({ field }) => {
                        return <RecurringChargesSelector {...field} paymentDate={paymentDate || new Date} setValue={(defaultValue: number) => setValue('recurring', defaultValue)} contract={contract.id} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>)}
                <Grid size={12}>
                    <Controller name="clarifications" control={control} render={({ field }) => {
                        return <TextField {...field} label="Aclaraciones" multiline maxRows={4} type="text" onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
            <ConfirmationAlert isAdmin={showOnRoles(user, [1,2])} isConfirmed={isConfirmed} isEdition={isEdition} setPaymentConfirmation={setPaymentConfirmation} />
        </DialogContent>
        <DialogActions>
            {((isEdition && !isConfirmed) || showOnRoles(user, [1,2])) && <Button disabled={loading} color="error" onClick={setDeletePayment}>BORRAR</Button>}
            {(!isConfirmed || showOnRoles(user, [1,2])) && <Button disabled={loading} onClick={handleSubmit((data) => onFormSubmit(data))}>{dialogLabel}</Button>}
        </DialogActions>
    </RspDialog>);
};

export default RecurringPaymentForm;