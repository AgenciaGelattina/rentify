'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StoreContext } from '@src/DataProvider';
import useSessionStorage from '@src/Hooks/useSessionStorage';
import PageWrapper from '@src/Components/Wrappers/Page';
import { CardContent, CardActions, TextField, Divider, Button, Box, Alert, Typography } from '@mui/material';
import { LoadingDialog, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
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
    const { state, setMainState } = useContext(StoreContext);
    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const auth = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const sessionStorage = useSessionStorage();
    const [tokenValidation, setTokenValidation] = useState<boolean>(true);
    const { validateResult } = useDataResponse();

    const onFormSubmit = (data: TAuthValues) => {
        auth.fetchData.post('/auth/login.php', data);
    }

    useEffect(() => {
        const token = sessionStorage?.getItem('token');
        if (token && state.user.id === 0) {
            auth.fetchData.get('/auth/token.php', { token });
        } else {
            setTokenValidation(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStorage, state.user.id]);

    useEffect(() => {
        const user = validateResult(auth.result);
        if (user && user.id > 0) {
            const userData = { ...user };
            if (user.token) {
                sessionStorage?.setItem('token', user.token);
            }
            setMainState(STATE_ACTIONS.SET_USER, userData);
            
        } else {
            setTokenValidation(false);
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
                <Typography variant="caption">{`${process.env.NEXT_PUBLIC_APP_VERSION!}`}</Typography>
            </Box>
        </SLogBox>
        <LoadingDialog show={auth.loading || tokenValidation} />
    </PageWrapper>);
}

export default AuthUser;