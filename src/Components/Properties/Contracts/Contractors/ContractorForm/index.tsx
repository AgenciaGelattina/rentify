import { FC, useEffect } from 'react';
import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Button, DialogActions, DialogContent, Divider, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { fieldError, getUIKey } from '@src/Utils';
import { isNil, isNotNil } from 'ramda';

export interface IContractor {
    id: number;
    names: string;
    surnames: string;
    email: string;
    phone: string;
}

export type TContractorForm = {
    contractor?: IContractor;
    contract_id: number;
    open: boolean;
}

type TContractorFormProps = {
    setOpen: (constractor: TContractorForm) => void;
    getContractors: () => void;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    names: yup.string().required(),
    surnames: yup.string().required(),
    email: yup.string().required("Por favor escriba un correo electrónico").email("El correo debe tener formato válido"),
    phone: yup.string().required("Por favor escriba un teléfono de contacto.")
});

export const defaultContractor: IContractor = {
    id: 0,
    names: "",
    surnames: "",
    email: "",
    phone: ""
}

const ContractorForm: FC<TContractorFormProps & TContractorForm> = ({ contractor, contract_id, open, setOpen, getContractors }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, getValues, setValue, formState: { errors }, reset } = useForm({ defaultValues: defaultContractor, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (open) {
            if (isNotNil(contractor)) {
                reset(contractor);
            }
        }
        return () => {
            reset(defaultContractor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract_id, contractor, setValue, reset]);

    const closeContractorForm = () => {
        setOpen({ open: false, contract_id });
    }

    const onFormSubmit = (data: FieldValues) => {
        const dataToSave = { ...data, contract: contract_id };
        fetchData.post('/properties/contracts/contractors/contractor.php', dataToSave, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                getContractors();
                closeContractorForm();
            }
        });
    }
    
    return (<RspDialog open={open} maxWidth="sm" onClose={closeContractorForm} >
        <RspDialogTitle title={isNil(contractor) ?  'NUEVO INQUILINO' :  'EDITAR INQUILINO'} onClose={closeContractorForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} md={6}>
                    <Controller name="names" control={control} render={({ field }) => {
                        return <TextField id="names" label="Nombres" type="text" {...field} {...fieldError(errors.names)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="surnames" control={control} render={({ field }) => {
                        return <TextField id="surnames" label="Apellidos" type="text" {...field} {...fieldError(errors.surnames)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={4}>
                    <Controller name="phone" control={control} render={({ field }) => {
                        return <TextField id="phone" label="Teléfono" type="text" {...field} {...fieldError(errors.phone)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={8}>
                    <Controller name="email" control={control} render={({ field }) => {
                        return <TextField id="email" label="Correo Electrónico" type="text" {...field} {...fieldError(errors.email)} onChange={(e) => field.onChange(e)} fullWidth />
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

export default ContractorForm;