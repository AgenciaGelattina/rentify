import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, DialogActions, DialogContent, Divider, FormControlLabel, MenuItem, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DatePicker } from "@mui/x-date-pickers";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import ConditionalAlert from "@src/Components/ConditionalAlert";
import CurrencySelector, { ICurrency } from "@src/Components/Forms/CurrencySelector";
import DueDateSelector from "@src/Components/Forms/DueDateSelector";
import ErrorHelperText from "@src/Components/Forms/ErrorHelperText";
import PropertyDetails, { IProperty } from "@src/Components/Properties/Details";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import { DATE_FORMAT } from "@src/Constants";
import useDataResponse from "@src/Hooks/useDataResponse";
import { fieldError, formatDate, getOnlyDate, getUIKey } from "@src/Utils";
import { add } from "date-fns";
import { clone, isNil, isNotNil } from "ramda";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Controller, FieldArrayWithId, FieldValues, Resolver, useForm, useFormState } from "react-hook-form";
import * as yup from 'yup';
import ContractDetails, { IContract, TContractType } from "../../Details";
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import Folders, { IFolder } from "./Folders";
import Contractors, { IContractor } from "./Contractors";

export interface IRenewContractModal {
    open: boolean;
    contract?: IContract;
    property?: IProperty;
}

export interface IRenewContractData {
    type: TContractType;
    property: number;
    value: number;
    currency: ICurrency;
    due_date: number;
    start_date: Date | null;
    end_date: Date | null;
    in_date: Date | null;
    out_date: Date | null;
};

interface IRenewContractProps extends IRenewContractModal {
    setOpen: (renewData: IRenewContractModal) => void;
};

const formValidations = yup.object().shape({
    type: yup.string().required(),
    property: yup.number().required(),
    currency: yup.string().required(),
    value: yup.number().min(1, "Escriba un importe mayor a $1.").required("Escriba un importe."),
    due_date: yup.number().required("Agregar el día de corte"),
    start_date: yup.date().nullable(),
    end_date: yup.date().nullable(),
    in_date: yup.date().nullable(),
    out_date: yup.date().nullable()
});

export const defaultContractValues: IRenewContractData = {
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

const RenewContract: FC<IRenewContractProps> = ({ contract, property, open, setOpen }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, watch, setValue, setError, formState: { errors }, reset } = useForm<IRenewContractData>({ defaultValues: defaultContractValues, resolver: yupResolver(formValidations) as Resolver<IRenewContractData> });
    const { isDirty } = useFormState({ control });
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [contractors, setContractors] = useState<IContractor[]>([])
    const startDate = watch('start_date', null);
    const endDate = watch('end_date', null);
    const inDate = watch('in_date', null);

    useEffect(() => {
        if (isNotNil(contract) && isNotNil(property) &&open) {
            fetchData.get('/properties/contracts/renew.php', { contract_id: contract.id, property_id: property.id  }, (response: TCallBack) => {
                const contractToRenew = validateResult(response.result);
                if (contractToRenew) {
                    const { property, currency, due_date, folders, contractors } = contractToRenew;
                    reset({ ...defaultContractValues, property, currency, due_date });
                    setFolders(folders);
                    setContractors(contractors);
                } else {
                    setOpen({ open: false });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, open]);

    const onFormSubmit = (data: FieldValues) => {
        const { start_date, end_date, in_date, out_date } = data;
        
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

        //fix date format
        data.start_date = formatDate(start_date);
        data.end_date = formatDate(end_date);
        data.in_date = formatDate(in_date);
        data.out_date = formatDate(out_date);

        const selectedFolders: IFolder[] = folders.filter((fld: IFolder) => fld.selected);
        const newFolders = selectedFolders.map((fld: IFolder) => {
            const filesNames: string[] = Array(fld.files).fill(0).map(() => getUIKey({ removeHyphen: true, toUpperCase: true }));
            return { name: getUIKey({ removeHyphen: true, toUpperCase: true }), title: fld.title, description: fld.description, copy_from: fld.name, files_name: filesNames };
        });

        const newContractors: IContractor[] = contractors.filter((cnts: IContractor) => cnts.selected);

        const dataToSave = { ...data, folders: newFolders, contractors: newContractors };

        fetchData.post('/properties/contracts/renew.php', dataToSave, (response: TCallBack) => {
            const success = validateResult(response.result);
            if (success) {
                setOpen({ open: false });
            }
        });
    };

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="RENOVACIÓN DE CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(property) && <PropertyDetails property={property} />}
            {isNotNil(contract) && <ContractDetails contract={contract} />}
            <ConditionalAlert condition={true} severity="info" title="Renovación de contrato." message="Seleccione las nuevas fechas del nuevo contrato." />
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="start_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Mes de Inicio" {...field}
                            format={DATE_FORMAT.DATE}
                            onChange={(selectedDate: Date | null) => {
                                field.onChange(selectedDate);
                                setValue("end_date", selectedDate ? add(new Date(selectedDate), { months: 12 }) : null);
                                setValue("in_date", selectedDate);
                                setValue("out_date", selectedDate ? add(new Date(selectedDate), { months: 12 }) : null);
                            }}
                        />
                    }} />
                    <ErrorHelperText {...fieldError(errors.start_date)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller name="end_date" control={control} render={({ field }) => {
                        return <DatePicker sx={{ width: '100%' }} className='MuiDatePicker' label="Mes de Vencimiento" {...field}
                            format={DATE_FORMAT.DATE}
                            disabled={isNil(startDate)}
                            minDate={isNotNil(startDate) ? add(new Date(startDate), { days: 1 }) : undefined}
                            onChange={(selectedDate: Date | null) => {
                                setValue("out_date", selectedDate);
                                field.onChange(selectedDate)
                            }} 
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
                                minDate={isNotNil(inDate) ? add(new Date(inDate), { days: 1 }) : undefined}
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
                            return <DueDateSelector field={field} startDate={startDate} />
                        }} />
                    </Grid>
                </Grid>
                <Folders folders={folders} setFolders={setFolders} />
                <Contractors contractors={contractors} setContractors={setContractors} />
            </>)}
            <DialogActions>
                <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>RENOVAR CONTRATO</Button>
            </DialogActions>
        </DialogContent>
    </RspDialog>);
};

export default RenewContract;