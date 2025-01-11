import { Dispatch, FC, SetStateAction, useEffect } from "react";
import * as yup from 'yup';
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { Controller, FieldValues, Resolver, useForm, useFormState } from "react-hook-form";
import Grid from '@mui/material/Grid2';
import { yupResolver } from "@hookform/resolvers/yup";
import { isNotNil } from "ramda";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import { Button, DialogActions, DialogContent, Divider, TextField } from "@mui/material";
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import { fieldError } from "@src/Utils";
import { IExpressCharge } from "../Details";

export interface IExpressChargeData {
    id: number;
    contract: number;
    label: string;
    value: number;
    canceled: number;
};

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    label: yup.string().required("Por favor escriba una Etiqueta para identificar el pago."),
    value: yup.number().min(1, "Escriba un importe mayor a $1.").required("Escriba un importe."),
    canceled: yup.number()
});

export interface IExpressChargeForm {
    open: boolean;
    expressCharge: IExpressCharge | null;
};

interface IExpressChargeFormProps extends IExpressChargeForm {
    contract: { 
        id: number;
    };
    setExpressChargeForm: Dispatch<SetStateAction<IExpressChargeForm>>;
    loadExpressCharges: () => void;
}

const defaultExptessPaymentData = (contract_id: number): IExpressChargeData => {
    return {
        id: 0,
        contract: contract_id,
        label: "",
        value: 0,
        canceled: 0
    }
};

const ExpressChargeForm: FC<IExpressChargeFormProps> = ({ open, contract, expressCharge, setExpressChargeForm, loadExpressCharges }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, getValues, formState: { errors }, reset } = useForm<IExpressChargeData>({ defaultValues: defaultExptessPaymentData(contract.id), resolver: yupResolver(formValidations) as Resolver<IExpressChargeData> });
    const { isDirty } = useFormState({ control });
    const isEditing = watch('id') > 0;
    const isCanceled = watch('canceled') === 1;

    useEffect(() => {
        if (isNotNil(expressCharge)) {
            const { id, label, value, canceled } = expressCharge;

            const dataToEdit: IExpressChargeData = {
                id,
                label,
                value,
                contract: contract.id,
                canceled: canceled ? 1 : 0
            };
            reset(dataToEdit);
        }
        return () => {
            reset(defaultExptessPaymentData(contract.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expressCharge]);

    const closeExpressChargeForm = () => {
        setExpressChargeForm({ open: false, expressCharge: null });
    }

    const onFormSubmit = (data: FieldValues) => {
        fetchData.post('/properties/contracts/charges/express/charges.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                reset();
                loadExpressCharges();
                closeExpressChargeForm();
            }
        });
    };

    const cancelExpressCharge = () => {
        const id = getValues('id');
        const cancel = getValues('canceled') === 0 ? 1 : 0;
        fetchData.post('/properties/contracts/charges/express/cancel.php', { id, cancel }, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                reset();
                loadExpressCharges();
                closeExpressChargeForm();
            }
        });
    }

    const deleteExpressCharge = () => {
        const id = getValues('id');
        fetchData.post('/properties/contracts/charges/express/delete.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                reset();
                loadExpressCharges();
                closeExpressChargeForm();
            }
        });
    }

    return (<RspDialog open={open} maxWidth="md" onClose={closeExpressChargeForm} >
        <RspDialogTitle title={`${isEditing ? 'EDITAR' : 'NUEVO'} COBRO`} onClose={closeExpressChargeForm} />
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
        </DialogContent>
        <DialogActions>
            {isEditing && isCanceled && <Button color="error" disabled={loading} onClick={deleteExpressCharge}>
                BORRAR
            </Button>}
            {isEditing && <Button color="warning" disabled={loading} onClick={cancelExpressCharge}>
                    {isCanceled ? "REACTIVAR": "CANCELAR"}
            </Button>}
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>);


};

export default ExpressChargeForm;