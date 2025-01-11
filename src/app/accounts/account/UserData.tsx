'use client';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CardActions, CardContent, TextField, Button, Divider, Box } from '@mui/material';
import CardBox from '@src/Components/Wrappers/CardBox';
import Grid from '@mui/material/Grid2';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import { fieldError } from '@src/Utils';
import { IUser } from '@src/DataProvider/interfaces';
import { useEffect } from 'react';
import useDataResponse from '@src/Hooks/useDataResponse';

type TAccountData = {
    id?: number;
    names: string;
    surnames: string;
    email: string;
    role?: number;
}

const formValidations = yup.object().shape({
    names: yup.string().required("Por favor, escriba sus nombres."),
    surnames: yup.string().required("Por favor, escriba su apellido."),
    email: yup.string().required("Por favor, escriba su correo electrónico.").email("El correo debe tener formato válido."),
})

const defaultValues = {
    names: "",
    surnames: "",
    email: "",
}

type TUSerData = {
    user: IUser;
}

const UserData: React.FC<TUSerData> = ({ user }) => {
    const { fetchData, loading, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, formState: { errors }, reset } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { validateResult } = useDataResponse();

    useEffect(() => {
        if (user.id > 0) {
            fetchData.get('/accounts/account/user.php', { id: user.id }, (response: TCallBack) => {
                const user = validateResult(response.result);
                if (user) {
                    reset(user);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id]);

    const onFormSubmit = (data: TAccountData) => {
        fetchData.post('/accounts/account/user.php', data, (response: TCallBack) => {
            validateResult(response.result);
        });
    }

    return (<Box sx={{ marginTop: '1rem' }}>
        <Header title="ACCOUNT" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
        <CardBox>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller name="names" control={control} render={({ field }) => {
                            return <TextField id="names" label="Names" type="text" {...field} {...fieldError(errors.names)} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller name="surnames" control={control} render={({ field }) => {
                            return <TextField id="surnames" label="Surnames" type="text" {...field} {...fieldError(errors.surnames)} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller name="email" control={control} render={({ field }) => {
                            return <TextField id="email" label="Email" type="text" {...field} {...fieldError(errors.email)} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'end' }}>
                <Button disabled={loading} variant="contained" onClick={handleSubmit((data) => onFormSubmit(data))}>
                    {loading ? "GUARDANDO..." : "GUARDAR"}
                </Button>
            </CardActions>
        </CardBox>
    </Box>);
}

export default UserData;