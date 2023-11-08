import { useEffect } from 'react';
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFetchData, TCallBack, useSnackMessages } from '@phoxer/react-components';
import { DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, FormControlLabel, Switch, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import RolesSelector from '@src/Components/Forms/RolesSelector';
import RspDialog from '@src/Components/RspDialog';
import { fieldError } from '@src/Utils';

export type TUserForm = {
    id: number;
    open: boolean;
}

type IUserFormProps = {
    setOpen: (userForm: TUserForm) => void;
    getUsers: () => void;
}

interface IAccountData {
    id: number;
    names: string;
    surnames: string;
    email: string;
    role: number;
    password: string;
    created?: string;
    updated?: string;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    names: yup.string().required("Por favor escriba los nombres del usuario."),
    surnames: yup.string().required("Por favor escriba los apellidos del usuario."),
    email: yup.string().required("Por favor escriba un Correo").email("El correo debe tener formato válido"),
    password: yup.string().required("Por favor escriba un Pasword"),
    role: yup.number().required()
});

const defaultValues: IAccountData = {
    id: 0,
    names: "",
    surnames: "",
    email: "",
    password: "12345",
    role: 1
}

const UserForm: React.FC<TUserForm & IUserFormProps> = ({ id, open, setOpen, getUsers }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, formState: { errors }, reset, register } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });
    const { showSnackMessage } = useSnackMessages()

    useEffect(() => {
        if (open && id > 0) {
            fetchData.get('/accounts/user.php', { id }, (response: TCallBack) => {
                if(response.result) {
                    reset({ ... response.result, password: '-' });
                    return;
                }
                if (response.error) {
                    showSnackMessage({ message: response.error.message, severity: "error" });
                    return;
                }
            });
        }
        return () => {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, open]);

    const onFormSubmit = (data: IAccountData) => {
        fetchData.post('/accounts/user.php', data, (response: TCallBack) => {
            if (response.error) {
                showSnackMessage({ message: response.error.message, severity: "error" });
                return;
            }
            if (response.result && response.result.success === 1) {
                setOpen({ open: false, id: 0 });
                getUsers();
            }
        });
    }

    return (<RspDialog open={open} onClose={() => setOpen({ open: false, id: 0 })}>
        <DialogTitle>{id > 0 ?  'EDITAR USUARIO' : 'NUEVO USUARIO'}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12} md={6}>
                    <Controller name="names" control={control} render={({ field }) => {
                        return <TextField id="names" label="Names" type="text" {...field} {...fieldError(errors.names)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={6}>
                    <Controller name="surnames" control={control} render={({ field }) => {
                        return <TextField id="surnames" label="Surnames" type="text" {...field} {...fieldError(errors.surnames)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={8}>
                    <Controller name="email" control={control} render={({ field }) => {
                        return <TextField id="email" label="Email" type="text" {...field} {...fieldError(errors.email)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid xs={12} md={4}>
                    <Controller name="role" control={control} render={({ field }) => {
                        return <RolesSelector {...field} />;
                    }} />
                </Grid>
                {id === 0 && (<>
                    <Divider />
                    <Grid xs={12} md={6}>
                        <Controller name="password" control={control} render={({ field }) => {
                            return <TextField id="password" label="Temporal Password" type="text" {...field} {...fieldError(errors.password)} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                </>)}
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} color='error' onClick={() => setOpen({ open: false, id: 0 })}>CANCELAR</Button>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>)
}

export default UserForm;