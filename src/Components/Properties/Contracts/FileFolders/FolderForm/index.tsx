import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import { Button, DialogActions, DialogContent, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { fieldError, getUIKey } from '@src/Utils';
import { useEffect } from 'react';
import { isEmpty } from 'ramda';

export type TFolderForm = {
    name: string;
    contract_id: number;
    open: boolean;
}

interface IFolderFormProps {
    setOpen: (fileFolder: TFolderForm) => void;
    getFolders: () => void;
}

interface IFolder {
    name: string;
    contract_id: number;
    title: string;
    description: string;
    action: string;
}

const formValidations = yup.object().shape({
    name: yup.string().required(),
    contract_id: yup.number().required(),
    title: yup.string().required("Escriba el título de la carpeta."),
    description: yup.string(),
    action: yup.string()
});

const defaultValues: IFolder = {
    name: "",
    contract_id: 0,
    title: "",
    description: "",
    action: 'create'
}

const FolderForm: React.FC<IFolderFormProps & TFolderForm> = ({ name, contract_id, open, setOpen, getFolders }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, getValues, setValue, formState: { errors }, reset } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (open) {
            setValue('contract_id', contract_id);
            if (!isEmpty(name)) {
                fetchData.get('/properties/contracts/folder.php', { name }, (response: TCallBack) => {
                    if (response.result) {
                        reset({ ...response.result, action: 'update' });
                    }
                });
            } else {
                setValue('name', getUIKey({ removeHyphen: true, toUpperCase: true }));
            }
        }
        return () => {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract_id, name, setValue, reset]);

    const closeFolerForm = () => {
        setOpen({ open: false, name: "", contract_id })
    }

    const onFormSubmit = (data: FieldValues) => {
        fetchData.post('/properties/contracts/folder.php', data, (response: TCallBack) => {
            if (response.result) {
                const { success, error } = response.result;
                if (success) {
                    getFolders();
                    closeFolerForm();
                }
            }
            if (response.error) {
                console.log(response.error)
            }
        });
    }
    
    return (<RspDialog open={open} maxWidth="sm" onClose={closeFolerForm} >
        <RspDialogTitle title={isEmpty(name) ?  'NUEVA CARPETA' :  'EDITAR CARPETA'} onClose={closeFolerForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12}>
                    <Controller name="title" control={control} render={({ field }) => {
                        return <TextField id="title" label="TÍTULO" type="text" {...field} {...fieldError(errors.title)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12}>
                    <Controller name="description" control={control} render={({ field }) => {
                        return <TextField id="description" label="DESCRIPCIÓN" type="text" {...field} onChange={(e) => field.onChange(e)} multiline fullWidth />
                    }} />
                </Grid>
                <Grid xs={12}>
                    <TextField label="NOMBRE DE CARPETA" value={getValues('name')} InputProps={{
                        readOnly: true,
                    }} fullWidth />
                </Grid>
            </Grid>
            <Divider />
        </DialogContent>
        <DialogActions>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>) 

}

export default FolderForm;