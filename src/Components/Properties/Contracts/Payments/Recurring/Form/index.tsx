import { Button, DialogActions, DialogContent, Divider, TextField } from "@mui/material";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import Grid from '@mui/material/Unstable_Grid2';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { Controller, FieldValues, Resolver, useForm, useFormState } from "react-hook-form";
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fieldError } from "@src/Utils";
import { isNil } from "ramda";
import ErrorHelperText from "@src/Components/Forms/ErrorHelperText";
import { DatePicker } from "@mui/x-date-pickers";
import { add } from "date-fns";

export interface IRecurringPayment {
    id: number;
    contract: number;
    label: string;
    value: number;
    start_date: Date | null;
    end_date: Date | null;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    label: yup.string().required("Por favor escriba una Etiqueta de pago recurrente."),
    value: yup.number().min(1, "Escriba un importe mayor a $1.").required("Escriba un importe."),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
});

export interface IRecurringPaymentForm {
    open: boolean;
    recurringPayment: IRecurringPayment | null;
}

interface IRecurringPaymentFormProps extends IRecurringPaymentForm {
    contract: { 
        id: number;
        startDate: Date;
        endDate: Date;
    };
    setRecurringPaymentForm: Dispatch<SetStateAction<IRecurringPaymentForm>>;
    loadRecurringPayments: () => void;
}

const defaultRecurringPaymentData = (contract_id: number): IRecurringPayment => {
    return {
        id: 0,
        contract: contract_id,
        label: "",
        value: 0,
        start_date: null,
        end_date: null
    }
}


const RecurringPaymentForm: FC<IRecurringPaymentFormProps> = ({ open, contract, recurringPayment, setRecurringPaymentForm, loadRecurringPayments }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, formState: { errors }, reset } = useForm<IRecurringPayment>({ defaultValues: defaultRecurringPaymentData(contract.id), resolver: yupResolver(formValidations) as Resolver<IRecurringPayment> });
    const { isDirty } = useFormState({ control });
    const startDate = watch('start_date') || undefined;
    const endDate = watch('end_date') || undefined;
    const isEditing = watch('id') > 0;

    useEffect(() => {
        if (recurringPayment) {
            const dataToEdit = { ...recurringPayment };
            dataToEdit.start_date = new Date(recurringPayment.start_date || "");
            dataToEdit.end_date = new Date(recurringPayment.end_date || "");
            reset(dataToEdit);
        }
        return () => {
            reset(defaultRecurringPaymentData(contract.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recurringPayment]);

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date } = data;

        if (isNil(start_date)) {
            setError('start_date', { type: "error", message: "Seleccione una fecha de inicio." });
            return false;
        }

        if (isNil(end_date)) {
            setError('end_date', { type: "error", message: "Seleccione una fecha de finalización." });
            return false;
        }

        fetchData.post('/properties/contracts/payments/recurring/recurring.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                reset();
                loadRecurringPayments();
                setRecurringPaymentForm({ open: false, recurringPayment: null });
            }
        });
    }

    const startDateMaxDate = useMemo(() => {
        return add(new Date(isNil(endDate) ? contract.endDate : endDate), { months: -1 });
    }, [endDate, contract]);

    const endDateMinDate = useMemo(() => {
        return add(new Date(isNil(startDate) ? contract.startDate : startDate), { months: 1 });
    }, [startDate, contract]);

    return (<RspDialog open={open} maxWidth="md" onClose={() => setRecurringPaymentForm({ open: false, recurringPayment: null })} >
        <RspDialogTitle title={`${isEditing ? 'EDITAR' : 'NUEVO'} PAGO RECURRENTE`} onClose={() => setRecurringPaymentForm({ open: false, recurringPayment: null })} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} md={6}>
                    <Controller name="value" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Cobro Mensual" {...fieldError(errors.value)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="label" control={control} render={({ field }) => {
                        return <TextField id="label" label="Etiqueta" type="text" {...field} {...fieldError(errors.label)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} sm={6}>
                    <Controller name="start_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} label="Fecha de inicio" {...field}
                        format="dd/MM/yyyy"
                        defaultValue={contract.startDate}
                        minDate={contract.startDate}
                        maxDate={startDateMaxDate}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} />
                    }} />
                    <ErrorHelperText {...fieldError(errors.start_date)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <Controller name="end_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} label="Fecha de vencimiento" {...field}
                        format="dd/MM/yyyy"
                        defaultValue={contract.endDate}
                        minDate={endDateMinDate}
                        maxDate={contract.endDate}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} />
                    }} />
                    <ErrorHelperText {...fieldError(errors.end_date)} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>) 
}

export default RecurringPaymentForm;