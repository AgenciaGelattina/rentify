import { FC, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, FieldValues, Resolver, useForm, useFormState } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { ConditionalRender, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ErrorHelperText from '@src/Components/Forms/ErrorHelperText';
import { fieldError, getUIKey } from '@src/Utils';
import TextFieldMoney from '@src/Components/Forms/TextFieldMoney';
import { Box, Button, DialogActions, MenuItem, TextField } from '@mui/material';
import { isNil, clone, isNotNil } from 'ramda';
import { add, getDaysInMonth } from 'date-fns';
import ConditionalAlert from '@src/Components/ConditionalAlert';
import { IProperty } from '@src/Components/Properties/Details';
import { DATE_FORMAT } from '@src/Constants';

export interface IContractData {
    id: number;
    property: number;
    value: number;
    due_date: number;
    start_date: Date | null;
    end_date: Date | null;
}

export const formatContractData = (contract: IContractData) => {
    const contractData = clone(contract);
    contractData.start_date = contract.start_date ? new Date(contract.start_date) : null;
    contractData.end_date = contract.end_date ? new Date(contract.end_date) : null;
    contractData.value = 0;
    return contractData;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    property: yup.number().required(),
    value: yup.number().when("id", {
        is: (id: number) => id === 0,
        then: (schema) => schema.min(1, "Escriba un importe mayor a $1.").required("Escriba un importe.")
    }),
    due_date: yup.number().required("Agregar el día de corte"),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable()
});

export const defaultContractValues: IContractData = {
    id: 0,
    property: 0,
    value: 0,
    due_date: 15,
    start_date: null,
    end_date: null
}

interface IContractFormProps {
    property: IProperty;
    contract: IContractData | null;
    onContractDataSaved: () => void;
}

const ContractForm: FC<IContractFormProps> = ({ property, contract, onContractDataSaved }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, watch, setValue, setError, formState: { errors }, reset } = useForm<IContractData>({ defaultValues: defaultContractValues, resolver: yupResolver(formValidations) as Resolver<IContractData> });
    const { isDirty } = useFormState({ control });
    const isNewContract = watch('id', 0) === 0;
    const startDate = watch('start_date', null);

    useEffect(() => {
        if (isNotNil(contract)) {
            reset(formatContractData(contract));
        }
        setValue('property', property.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, property]);

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date } = data;
        
        if (isNil(start_date)) {
            setError('start_date', { type: "error", message: "Seleccione una fecha de inicio de contrato." });
            return false;
        }
        if (isNil(end_date)) {
            setError('end_date', { type: "error", message: "Seleccione una fecha de finalización de contrato." });
            return false;
        }

        if (data.id === 0) {
            // default folders files
            data.folders = [
                { name: getUIKey({ removeHyphen: true, toUpperCase: true }), title: "Archivos Del Contrato" },
                { name: getUIKey({ removeHyphen: true, toUpperCase: true }), title: "Fotos de la Propiedad" }
            ];
        }
        fetchData.post('/properties/contracts/contract.php', data, (response: TCallBack) => {
            const success = validateResult(response.result);
            if (success) {
                onContractDataSaved();
            }
        });
    }

    const dueDatesList = useMemo(() => {
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
        return dueDates;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate]);

    console.log('startDate', startDate)
    
    return (<>
        <ConditionalAlert condition={isNewContract} severity="warning" title="No hay un contrato vigente." message="Inicie un contrato nuevo." />
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid xs={12} sm={6}>
                <Controller name="start_date" control={control} render={({ field }) => {
                    return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Mes de Inicio" {...field}
                        format={DATE_FORMAT.DATE}
                        readOnly={!isNewContract}
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
                        minDate={isNotNil(startDate) ? add(new Date(startDate), { months: 1 }) : undefined}
                        onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} 
                    />
                }} />
                <ErrorHelperText {...fieldError(errors.end_date)} />
            </Grid>
        </Grid>
        <ConditionalRender condition={isNotNil(startDate)}>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <ConditionalRender condition={isNewContract} >
                    <Grid xs={12} sm={6}>
                        <Controller name="value" control={control} render={({ field }) => {
                            return <TextFieldMoney {...field} label="Renta Mensual" {...fieldError(errors.value)} onChange={(e) => field.onChange(e)} disabled={isNil(startDate)} />
                        }} />
                    </Grid>
                </ConditionalRender>
                <Grid xs={12} sm={6}>
                    <Controller name="due_date" control={control} render={({ field }) => {
                        return (<TextField id="due_date" label="Día de Corte" {...field} onChange={(e) => field.onChange(e)} disabled={isNil(startDate)} select fullWidth>
                            {dueDatesList.map((dd => {
                                return <MenuItem key={`d${dd.value}`} value={dd.value}>{dd.text}</MenuItem>;
                            }))}
                        </TextField>);
                    }} />
                </Grid>
            </Grid>
        </ConditionalRender>
        
        <DialogActions>
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR CONTRATO</Button>
        </DialogActions>
    </>)
};

export default ContractForm;