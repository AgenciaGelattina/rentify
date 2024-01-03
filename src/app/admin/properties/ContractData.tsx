import { FC, useEffect } from 'react';
import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, DialogActions, Divider, MenuItem, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ConditionalRender, TCallBack, useFetchData, useSnackMessages } from '@phoxer/react-components';
import ConditionalAlert from '@src/Components/ConditionalAlert';
import LoadingBox from '@src/Components/LoadingBox';
import TextFieldMoney from '@src/Components/Forms/TextFieldMoney';
import { DatePicker } from '@mui/x-date-pickers';
import { fieldError } from '@src/Utils';
import { TPropertyDetails } from '@src/Components/Properties/Details';
import { isNil } from 'ramda';
import FileFolders from '@src/Components/Properties/Contracts/FileFolders';
import useDataResponse from '@src/Hooks/useDataResponse';



interface IContract {
    id: number;
    property: number;
    value: number;
    due_date: number;
    init_date: Date | null;
    end_date: Date | null;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    property: yup.number().required(),
    value: yup.number().min(1, "Escriba un importe mayor a $1.").required("Escriba un importe."),
    due_date: yup.number().required("Agregar el día de corte"),
    init_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
});

const defaultValues: IContract = {
    id: 0,
    property: 0,
    value: NaN,
    due_date: 15,
    init_date: null,
    end_date: null
}

type TContractData = {
    property: TPropertyDetails;
}

const getDueDates = () => {
    const dueDates = [
        { value: 1, text: "Día 1 (Inicio de Mes)" },
        { value: 15, text: "Día 15 (Mitad de Mes)" }
    ];     
    for (let i = 1; i <= 29; i++) {
        if (i !== 1 && i !== 15) {
            dueDates.push({ value: i, text: `Día ${i}`});
        }
    }
    return dueDates;
}

const ContractData: FC<TContractData> = ({ property }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, getValues, setValue, setError, formState: { errors }, reset } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });
    const { showSnackMessage } = useSnackMessages();

    const formatData = (contract: IContract) => {
        const contractData = { ...contract };
        if (contractData.id > 0) {
            contractData.init_date = new Date(contractData.init_date || "");
            contractData.end_date = new Date(contractData.end_date || "");
            console.log('TO SET', contractData);
            reset(contractData);
        } else {
            reset({ ...defaultValues, property: property.id });
        }
    }

    useEffect(() => {
        if (property && property.id > 0) {
            setValue('property', property.id);
            fetchData.get('/properties/contracts/contract.php', { property_id: property.id }, (response: TCallBack) => {
                const contract = validateResult(response.result);
                if (contract) {
                    formatData(contract);
                }
            });
        }
        return () => {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    const onFormSubmit = (data: FieldValues) => {
        const { init_date, end_date } = data;
        
        if (isNil(init_date)) {
            setError('init_date', { type: "error", message: "Seleccione una fecha de inicio de contrato." });
            return false;
        }
        if (isNil(end_date)) {
            setError('end_date', { type: "error", message: "Seleccione una fecha de finalización de contrato." });
            return false;
        }

        fetchData.post('/properties/contracts/contract.php', data, (response: TCallBack) => {
            const contract = validateResult(response.result);
            if (contract) {
                formatData(contract);
            }
        });
        
    }

    if (loading) {
        return <LoadingBox />
    }

    const contract_id = getValues('id');
    const isNewContract = contract_id === 0;

    return (<>
        <Divider />
        <ConditionalAlert condition={isNewContract} severity="warning" title="No hay un contrato vigente." message="Inicie un contrato nuevo o edite uno anterior." />
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid xs={12} sm={6}>
                <Controller name="value" control={control} render={({ field }) => {
                    return <TextFieldMoney {...field} {...fieldError(errors.value)} onChange={(e) => field.onChange(e)} />
                }} />
            </Grid>
            <Grid xs={12} sm={6}>
                <Controller name="due_date" control={control} render={({ field }) => {
                    return (<TextField id="due_date" label="Día de vencimiento" {...field} onChange={(e) => field.onChange(e)} select fullWidth>
                        {getDueDates().map((dd => {
                            return <MenuItem key={`d${dd.value}`} value={dd.value}>{dd.text}</MenuItem>;
                        }))}
                    </TextField>);
                }} />
            </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid xs={12} sm={6}>
                <Controller name="init_date" control={control} render={({ field }) => {
                    return <DatePicker label="Fecha de inicio" {...field} format="dd/MM/yyyy" onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} />
                }} />
            </Grid>
            <Grid xs={12} sm={6}>
                <Controller name="end_date" control={control} render={({ field }) => {
                    return <DatePicker label="Fecha de vencimiento" {...field} format="dd/MM/yyyy" onChange={(selectedDate: Date | null) => field.onChange(selectedDate)} />
                }} />
            </Grid>
        </Grid>
        <Divider />
        <DialogActions>
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
        <ConditionalRender condition={!isNewContract}>
            <FileFolders contract={{ id: contract_id }} />
        </ConditionalRender>
    </>);
}

export default ContractData;