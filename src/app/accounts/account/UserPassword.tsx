'use client';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Header } from "@phoxer/react-components";
import { CardActions, CardContent, TextField, Button, Divider, FormControlLabel, Switch, Box } from '@mui/material';
import CardBox from '@src/Components/Wrappers/CardBox';
import Grid from '@mui/material/Unstable_Grid2';
import KeyIcon from '@mui/icons-material/Key';
import { fieldError } from '@src/Utils';

type TAccountData = {
    password: string;
    passwordA: string;
    passwordB: string;
}

const formValidations = yup.object().shape({
    password: yup.string().required("Por favor, escriba un password"),
    passwordA: yup.string().required("Por favor, escriba un password")
      .min(8, "Password length should be at least 8 characters")
      .max(12, "Password cannot exceed more than 12 characters"),
    passwordB: yup.string().required("Por favor, confirme el password")
      .min(8, "Password length should be at least 8 characters")
      .max(12, "Password cannot exceed more than 12 characters")
      .oneOf([yup.ref("passwordA")], "Passwords do not match")
});

const defaultValues: TAccountData = {
    password: "",
    passwordA: "",
    passwordB: ""
}

const Password: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);
    const { handleSubmit, control, formState: { errors } } = useForm({ defaultValues, resolver: yupResolver(formValidations) });

    const onFormSubmit = (data: TAccountData) => {
        console.log(data);
    }

    const passwordType = show ? "text" : "password";

    return (<Box sx={{ marginTop: '2rem' }}>
        <Header title="PASSWORD" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} icon={<KeyIcon />}/>
        <CardBox>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                    <Grid xs={6}>
                        <Controller name="password" control={control} render={({ field }) => {
                            return <TextField id="password" label="Current Password" type={passwordType} {...fieldError(errors.password)} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    
                </Grid>
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <Controller name="passwordA" control={control} render={({ field }) => {
                            return <TextField id="passwordA" label="New Password" type={passwordType} {...fieldError(errors.passwordA)} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                    <Grid xs={6}>
                        <Controller name="passwordB" control={control} render={({ field }) => {
                            return <TextField id="passwordB" label="New Password Confirmation" {...fieldError(errors.passwordB)} type={passwordType} {...field} onChange={(e) => field.onChange(e)} fullWidth />
                        }} />
                    </Grid>
                </Grid>
                <FormControlLabel control={<Switch checked={show} onChange={() => setShow((s: boolean) => !s)} />} label="Show Passwords" />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'end' }}>
                <Button variant="contained" onClick={handleSubmit((data) => onFormSubmit(data))}>
                    CAMBIAR PASSWORD
                </Button>
            </CardActions>
        </CardBox>
    </Box>);
}

export default Password;