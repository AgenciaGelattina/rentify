'use client';
import { useState, useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import useSessionStorage from '@src/Hooks/useSessionStorage';
import { CardActions, CardContent, TextField, Button, Divider, FormControlLabel, Switch, Box } from '@mui/material';
import CardBox from '@src/Components/Wrappers/CardBox';
import Grid from '@mui/material/Unstable_Grid2';
import KeyIcon from '@mui/icons-material/Key';
import { fieldError } from '@src/Utils';
import { STATE_ACTIONS } from '@src/Constants';

type TAccountData = {
    password: string;
    passwordA: string;
    passwordB: string;
}

const formValidations = yup.object().shape({
    password: yup.string().required("Por favor, escriba el password actual."),
    passwordA: yup.string().required("Por favor, escriba un nuevo password.")
      .min(8, "El password debe de contener entre 8 a 12 caracteres.")
      .max(12, "El password no debe pasar de los 12 caracteres."),
    passwordB: yup.string().required("Por favor, confirme el nuevo password.")
      .min(8, "El password debe de contener entre 8 a 12 caracteres.")
      .max(12, "El password no debe pasar de los 12 caracteres.")
      .oneOf([yup.ref("passwordA")], "El password ingresado no coincide.")
});

const defaultValues: TAccountData = {
    password: "",
    passwordA: "",
    passwordB: ""
}

const Password: React.FC = () => {
    const { state, setMainState } = useContext(StoreContext);
    const { fetchData, loading, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const sessionStorage = useSessionStorage();
    const [show, setShow] = useState<boolean>(false);
    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues, resolver: yupResolver(formValidations) });

    const onFormSubmit = (data: TAccountData) => {
        fetchData.post(`/accounts/account/password.php?token=${state.user.token}`, { password: data.passwordA }, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                sessionStorage?.removeItem('token');
                setMainState(STATE_ACTIONS.LOGIN_OUT);
            }
        });
    }

    const passwordType = show ? "text" : "password";

    return (<Box sx={{ marginTop: '2rem' }}>
        <Header title="PASSWORD" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} icon={<KeyIcon />}/>
        <CardBox>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                    <Grid xs={6}>
                        <Controller name="password" control={control} render={({ field }) => {
                            return <TextField id="password" label="Password Actual" type={passwordType} {...fieldError(errors.password)} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    
                </Grid>
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <Controller name="passwordA" control={control} render={({ field }) => {
                            return <TextField id="passwordA" label="Nuevo Password" type={passwordType} {...fieldError(errors.passwordA)} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    <Grid xs={6}>
                        <Controller name="passwordB" control={control} render={({ field }) => {
                            return <TextField id="passwordB" label="Confirmar Nuevo Password" {...fieldError(errors.passwordB)} type={passwordType} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                </Grid>
                <FormControlLabel control={<Switch checked={show} onChange={() => setShow((s: boolean) => !s)} />} label="Mostrar Passwords" />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'end' }}>
                <Button variant="contained" onClick={handleSubmit((data) => onFormSubmit(data))}>
                    {loading ? "GUARDANDO..." : "CAMBIAR PASSWORD" }
                </Button>
            </CardActions>
        </CardBox>
    </Box>);
}

export default Password;