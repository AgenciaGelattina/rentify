import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DialogActions, MenuItem, TextField } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from "@mui/x-date-pickers";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import ConditionalAlert from "@src/Components/ConditionalAlert";
import CurrencySelector, { ICurrency } from "@src/Components/Forms/CurrencySelector";
import DueDateSelector from "@src/Components/Forms/DueDateSelector";
import ErrorHelperText from "@src/Components/Forms/ErrorHelperText";
import { IProperty } from "@src/Components/Properties/Details";
import { DATE_FORMAT } from "@src/Constants";
import useDataResponse from "@src/Hooks/useDataResponse";
import { fieldError, getOnlyDate } from "@src/Utils";
import { add } from "date-fns";
import { clone, isNil, isNotNil } from "ramda";
import { FC, useEffect, useMemo } from "react";
import { Controller, FieldValues, Resolver, useForm, useFormState } from "react-hook-form";
import * as yup from 'yup';

export interface IEditContractData {
    id: number;
    property: number;
    currency: ICurrency;
    due_date: number;
    start_date: Date | null;
    end_date: Date | null;
    in_date: Date | null;
    out_date: Date | null;
}

interface IEditContractProps {
    contract?: IEditContractData;
    onContractDataSaved: () => void;
    onCancel: () => void;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    property: yup.number().required(),
    currency: yup.string().required(),
    due_date: yup.number().required("Agregar el día de corte"),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
    in_date: yup.date().nullable(),
    out_date: yup.date().nullable()
});

export const defaultContractValues: IEditContractData = {
    id: 0,
    property: 0,
    currency: "mxn",
    due_date: 15,
    start_date: null,
    end_date: null,
    in_date: null,
    out_date: null
}

const formatContractData = (contract: IEditContractData) => {
    const contractData = clone(contract);
    contractData.start_date = contract.start_date ? new Date(contract.start_date) : null;
    contractData.end_date = contract.end_date ? new Date(contract.end_date) : null;
    contractData.in_date = contract.in_date ? new Date(contract.in_date) : null;
    contractData.out_date = contract.out_date ? new Date(contract.out_date) : null;
    return contractData;
}

const EditContract: FC<IEditContractProps> = ({ contract, onContractDataSaved, onCancel }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, watch, setValue, setError, formState: { errors }, reset } = useForm<IEditContractData>({ defaultValues: defaultContractValues, resolver: yupResolver(formValidations) as Resolver<IEditContractData> });
    const { isDirty } = useFormState({ control });
    const startDate = watch('start_date', null);
    const endDate = watch('end_date', null);
    const inDate = watch('in_date', null);

    useEffect(() => {
        if (isNotNil(contract)) {
            reset(formatContractData(contract));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract]);

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date, in_date, out_date } = clone(data);
        
        if (isNil(start_date)) {
            setError('start_date', { type: "error", message: "Seleccione una fecha de inicio de contrato." });
            return false;
        }
        if (isNil(end_date)) {
            setError('end_date', { type: "error", message: "Seleccione una fecha de finalización de contrato." });
            return false;
        }

        if (isNil(in_date)) {
            setError('in_date', { type: "error", message: "Seleccione una fecha de ingreso a la propiedad." });
            return false;
        }
        if (isNil(out_date)) {
            setError('out_date', { type: "error", message: "Seleccione una fecha de salida de la propiedad." });
            return false;
        }

        fetchData.post('/properties/contracts/contract.php', data, (response: TCallBack) => {
            const success = validateResult(response.result);
            if (success) {
                onContractDataSaved();
            }
        });
    };

    return (<>
        <ConditionalAlert condition={true} severity="warning" title="Se va a editar un contrato vigente." message="Esto podría traer errores en los cálculos actuales." />
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid xs={12} sm={6}>
                <Controller name="start_date" control={control} render={({ field }) => {
                    return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Mes de Inicio" {...field}
                        format={DATE_FORMAT.DATE}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                    />
                }} />
                <ErrorHelperText {...fieldError(errors.start_date)} />
            </Grid>
            <Grid xs={12} sm={6}>
                <Controller name="end_date" control={control} render={({ field }) => {
                    return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Mes de Vencimiento" {...field}
                        format={DATE_FORMAT.DATE}
                        disabled={isNil(startDate)}
                        minDate={isNotNil(startDate) ? add(new Date(startDate), { days: 1 }) : undefined}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} 
                    />
                }} />
                <ErrorHelperText {...fieldError(errors.end_date)} />
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} sm={6}>
                    <Controller name="in_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Fecha de Ingreso" {...field}
                            format={DATE_FORMAT.DATE}
                            minDate={isNotNil(startDate) ? startDate : undefined}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                        />
                    }} />
                    <ErrorHelperText {...fieldError(errors.in_date)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <Controller name="out_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Fecha de Salida" {...field}
                            format={DATE_FORMAT.DATE}
                            disabled={isNil(inDate)}
                            minDate={isNotNil(inDate) ? add(new Date(inDate), { days: 1 }) : undefined}
                            maxDate={isNotNil(endDate) ? endDate : undefined}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} 
                        />
                    }} />
                    <ErrorHelperText {...fieldError(errors.out_date)} />
                </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid xs={12} md={4}>
                    <Controller name="currency" control={control} render={({ field }) => {
                        return <CurrencySelector {...field} {...fieldError(errors.currency)} />
                    }} />
            </Grid>
            <Grid xs={12} sm={4}>
                <Controller name="due_date" control={control} render={({ field }) => {
                    return <DueDateSelector {...field} startDate={startDate} />
                }} />
            </Grid>
        </Grid>
        <DialogActions>
            <Button disabled={loading} onClick={onCancel}>CANCELAR</Button>
            <Button disabled={!isDirty || loading} color="error" onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR CONTRATO</Button>
        </DialogActions>
    </>);
};

export default EditContract;