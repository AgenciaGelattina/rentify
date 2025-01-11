import { FC, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Controller, FieldValues, Resolver, useForm, useFormState } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ErrorHelperText from '@src/Components/Forms/ErrorHelperText';
import { fieldError } from '@src/Utils';
import TextFieldMoney from '@src/Components/Forms/TextFieldMoney';
import { Button, DialogActions, MenuItem, TextField, Typography } from '@mui/material';
import { isNil, clone, isNotNil } from 'ramda';
import { add } from 'date-fns';
import { IProperty } from '@src/Components/Properties/Details';
import { DATE_FORMAT } from '@src/Constants';
import CurrencySelector, { ICurrency } from '@src/Components/Forms/CurrencySelector';
import DueDateSelector from '@src/Components/Forms/DueDateSelector';
import { INewContractData } from '..';


const defaultContractValues: INewContractData = {
    id: 0,
    type: "recurring",
    property: 0,
    currency: "mxn",
    value: 0,
    due_date: 15,
    start_date: null,
    end_date: null,
    in_date: null,
    out_date: null
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    type: yup.string().required(),
    property: yup.number().required(),
    currency: yup.string().required(),
    value: yup.number().when("id", {
        is: (id: number) => id === 0,
        then: (schema) => schema.min(1, "Escriba un importe mayor a $1.").required("Escriba un importe.")
    }),
    due_date: yup.number().required("Agregar el día de corte"),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
    in_date: yup.date().nullable(),
    out_date: yup.date().nullable()
});


interface INewRecurringContractProps {
    property: IProperty;
    loading: boolean;
    saveContractData: (data: FieldValues) => void;
}

const NewRecurringContract: FC<INewRecurringContractProps> = ({ property, loading, saveContractData }) => {
    const { handleSubmit, control, watch, setValue, setError, formState: { errors }, reset } = useForm<INewContractData>({ defaultValues: defaultContractValues, resolver: yupResolver(formValidations) as Resolver<INewContractData> });
    const { isDirty } = useFormState({ control });
    const startDate = watch('start_date', null);
    const endDate = watch('end_date', null);
    const inDate = watch('in_date', null);
    const outDate = watch('out_date', null);

    useEffect(() => {
        setValue('property', property.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    useEffect(() => {
        if(isNotNil(startDate) && isNil(inDate)) {
            setValue("in_date", startDate);
        };
        if(isNotNil(endDate) && isNil(outDate)) {
            setValue("out_date", endDate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date, in_date, out_date} = clone(data);
        
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

        saveContractData(data);
    }
    
    return (<>
        <Typography variant="caption" gutterBottom>Contrato con renta recurrente a meses.</Typography>
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="start_date" control={control} render={({ field }) => {
                    return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Día de Inicio" {...field}
                        format={DATE_FORMAT.DATE}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                    />
                }} />
                <ErrorHelperText {...fieldError(errors.start_date)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="end_date" control={control} render={({ field }) => {
                    return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Día de Vencimiento" {...field}
                        format={DATE_FORMAT.DATE}
                        disabled={isNil(startDate)}
                        minDate={isNotNil(startDate) ? add(new Date(startDate), { months: 2 }) : undefined}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} 
                    />
                }} />
                <ErrorHelperText {...fieldError(errors.end_date)} />
            </Grid>
        </Grid>
        {(isNotNil(startDate) && isNotNil(endDate)) && (<>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="in_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Fecha de Ingreso" {...field}
                            format={DATE_FORMAT.DATE}
                            minDate={isNotNil(startDate) ? startDate : undefined}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                        />
                    }} />
                    <ErrorHelperText {...fieldError(errors.in_date)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="out_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Fecha de Salida" {...field}
                            format={DATE_FORMAT.DATE}
                            disabled={isNil(inDate)}
                            defaultValue={endDate}
                            minDate={isNotNil(inDate) ? add(new Date(inDate), { months: 1 }) : undefined}
                            maxDate={isNotNil(endDate) ? endDate : undefined}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} 
                        />
                    }} />
                    <ErrorHelperText {...fieldError(errors.out_date)} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Controller name="currency" control={control} render={({ field }) => {
                        return <CurrencySelector {...field} {...fieldError(errors.currency)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller name="value" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Renta Mensual" {...fieldError(errors.value)} onChange={(e) => field.onChange(e)} disabled={isNil(startDate)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller name="due_date" control={control} render={({ field }) => {
                        return <DueDateSelector {...field} startDate={startDate} />
                    }} />
                </Grid>
            </Grid>
        </>)}
        
        <DialogActions>
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>CREAR CONTRATO</Button>
        </DialogActions>
    </>)
};

export default NewRecurringContract;