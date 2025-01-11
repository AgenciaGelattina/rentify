import { Alert, Button, DialogActions, DialogContent, Divider, TextField } from "@mui/material";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import Grid from '@mui/material/Grid2';
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { Controller, FieldValues, Resolver, useForm, useFormState } from "react-hook-form";
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { fieldError } from "@src/Utils";
import { clone, isNil, isNotNil } from "ramda";
import ErrorHelperText from "@src/Components/Forms/ErrorHelperText";
import { DatePicker } from "@mui/x-date-pickers";
import { add } from "date-fns";
import { IRecurringCharge } from "../Detail";

export interface IRecurringChargeData {
    id: number;
    contract: number;
    label: string;
    value: number;
    start_date: Date | null;
    end_date: Date | null;
    canceled: number;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    label: yup.string().required("Por favor escriba una Etiqueta para identificar el pago recurrente."),
    value: yup.number().min(1, "Escriba un importe mayor a $1.").required("Escriba un importe."),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
    canceled: yup.number()
});

export interface IRecurringChargeForm {
    open: boolean;
    recurringCharge: IRecurringCharge | null;
}

interface IContractData {
    id: number;
    startDate: Date;
    endDate: Date;
}

interface IRecurringChargeFormProps extends IRecurringChargeForm {
    contract: IContractData;
    setRecurringChargeForm: Dispatch<SetStateAction<IRecurringChargeForm>>;
    loadRecurringCharges: () => void;
}

const defaultRecurringChargeData = (contract: IContractData): IRecurringChargeData => {
    return {
        id: 0,
        contract: contract.id,
        label: "",
        value: 0,
        start_date: contract.startDate,
        end_date: contract.endDate,
        canceled: 0
    }
}


const RecurringChargeForm: FC<IRecurringChargeFormProps> = ({ open, contract, recurringCharge, setRecurringChargeForm, loadRecurringCharges }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, getValues, formState: { errors }, reset } = useForm<IRecurringChargeData>({ defaultValues: defaultRecurringChargeData(contract), resolver: yupResolver(formValidations) as Resolver<IRecurringChargeData> });
    const { isDirty } = useFormState({ control });
    const startDate = watch('start_date') || undefined;
    const endDate = watch('end_date') || undefined;
    const isEditing = watch('id') > 0;
    const isCanceled = watch('canceled') === 1;

    useEffect(() => {
        if (isNotNil(recurringCharge)) {
            const { id, label, value, start_date, end_date, canceled } = recurringCharge;

            const dataToEdit: IRecurringChargeData = {
                id,
                label,
                value,
                start_date: new Date(start_date || ""),
                end_date: new Date(end_date || ""),
                contract: contract.id,
                canceled: canceled ? 1 : 0
            };
            reset(dataToEdit);
        }
        return () => {
            reset(defaultRecurringChargeData(contract));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recurringCharge]);

    const closeRecurringChargeForm = () => {
        setRecurringChargeForm({ open: false, recurringCharge: null });
    }

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date } = clone(data);
        if (isNil(start_date)) {
            setError('start_date', { type: "error", message: "Seleccione una fecha de inicio." });
            return false;
        }

        if (isNil(end_date)) {
            setError('end_date', { type: "error", message: "Seleccione una fecha de finalización." });
            return false;
        }

        fetchData.post('/properties/contracts/charges/recurring/charges.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                reset();
                loadRecurringCharges();
                closeRecurringChargeForm();
            }
        });
    };

    const cancelRecurringCharge = () => {
        const id = getValues('id');
        const cancel = getValues('canceled') === 0 ? 1 : 0;
        fetchData.post('/properties/contracts/charges/recurring/cancel.php', { id, cancel }, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                reset();
                loadRecurringCharges();
                closeRecurringChargeForm();
            }
        });
    }

    const deleteRecurringCharge = () => {
        const id = getValues('id');
        fetchData.post('/properties/contracts/charges/recurring/delete.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                reset();
                loadRecurringCharges();
                closeRecurringChargeForm();
            }
        });
    }

    const startDateMaxDate = useMemo(() => {
        return add(new Date(isNil(endDate) ? contract.endDate : endDate), { months: -1 });
    }, [endDate, contract]);

    const endDateMinDate = useMemo(() => {
        return add(new Date(isNil(startDate) ? contract.startDate : startDate), { months: 1 });
    }, [startDate, contract]);

    return (<RspDialog open={open} maxWidth="md" onClose={closeRecurringChargeForm} >
        <RspDialogTitle title={`${isEditing ? 'EDITAR' : 'NUEVO'} COBRO MENSUAL`} onClose={closeRecurringChargeForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="value" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Total a Cobrar" {...fieldError(errors.value)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="label" control={control} render={({ field }) => {
                        return <TextField id="label" label="Etiqueta" type="text" {...field} {...fieldError(errors.label)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
            {isNotNil(recurringCharge) && recurringCharge.expired && <Alert severity="warning">El Cobro Recurrente está vencido.</Alert>}
            {isNotNil(recurringCharge) && !recurringCharge.expired && !isCanceled && <Alert severity="success">El Cobro Recurrente está vigente.</Alert>}
            {isCanceled && <Alert severity="error">El Cobro Recurrente está cancelado.</Alert>}
        </DialogContent>
        <DialogActions>
            {isEditing && isCanceled && <Button color="error" disabled={loading} onClick={deleteRecurringCharge}>
                BORRAR
            </Button>}
            {isEditing && <Button color="warning" disabled={loading} onClick={cancelRecurringCharge}>
                {isCanceled ? "REACTIVAR": "CANCELAR"}
            </Button>}
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>) 
}

export default RecurringChargeForm;