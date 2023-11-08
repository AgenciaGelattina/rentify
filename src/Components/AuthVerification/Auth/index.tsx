'use client';
import { FC, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StoreContext } from '@src/DataProvider';
import PageWrapper from '@src/Components/Wrappers/Page';
import { CardContent, CardActions, TextField, Divider, Button, Box, Alert, Typography } from '@mui/material';
import { LoadingDialog, useFetchData } from '@phoxer/react-components';
import { SLogBox, SLogo } from './styles';
import { fieldError } from '@src/Utils';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { STATE_ACTIONS } from '@src/Constants';

type TAuthValues = {
    email: string;
    password: string;
}

const formValidations = yup.object().shape({
    email: yup.string().required("Ingrese su correo electrónico").email("El correo electrónico no es válido"),
    password: yup.string().required("Ingrese su contraseña")
});

const defaultValues: TAuthValues = {
    email: "",
    password: ""
}

const AuthUser: FC = () => {
    const { setMainState } = useContext(StoreContext);
    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const auth = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);

    const onFormSubmit = (data: TAuthValues) => {
        auth.fetchData.post('/auth/login.php', data);
    }

    useEffect(() => {
        if (auth.result && auth.result.id > 0) {
            const userData = { ...auth.result };
            if (userData.token) {
                console.log(userData.token)
                delete(userData.token);
            }
            setMainState(STATE_ACTIONS.SET_USER, userData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.result, setMainState]);

    return (<PageWrapper centerContent={true}>
        <SLogBox>
            <SLogo>
                Rentify
            </SLogo>
            <CardContent>
                <Controller name="email" control={control} render={({ field }) => {
                    return <TextField id="email" label="Correo Electrónico" type="text" {...field} {...fieldError(errors.email)} onChange={(e) => field.onChange(e)} fullWidth />
                }} />
                <Controller name="password" control={control} render={({ field }) => {
                    return <TextField id="password" label="Contraseña" type="password" {...field} {...fieldError(errors.password)} onChange={(e) => field.onChange(e)} fullWidth />
                }} />
                {auth.error && auth.error.message && <Alert severity="error">{auth.error.message}</Alert>}
            </CardContent>
            <CardActions>
                <Button fullWidth onClick={handleSubmit((data) => onFormSubmit(data))}>
                    AUTENTIFICAR
                </Button>
            </CardActions>
            <Divider />
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption">{`V${process.env.NEXT_PUBLIC_APP_VERSION!}`}</Typography>
            </Box>
        </SLogBox>
        <LoadingDialog show={auth.loading} />
    </PageWrapper>);
}

export default AuthUser;