import { useEffect } from 'react';
import { useForm, Controller, useFormState, FieldValues, Resolver } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { DialogContent, DialogActions, TextField, Button, Divider} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { fieldError } from '@src/Utils';
import PropertiesStatusSelector from '@src/Components/Forms/PropertiesStatus';
import PropertiesTypeSelector from '@src/Components/Forms/PropertiesType';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import { isNotNil } from 'ramda';

export interface IPropertyData {
    id: number;
    open: boolean;
}

interface IPropertyDataProps extends IPropertyData {
    setOpen: (propertyData: IPropertyData) => void;
    getProperties: () => void;
}

export type TPropertyData = {
    id: number;
    title: string;
    description: string;
    type: number;
    group: number;
    status: number;
}


const formValidations = yup.object().shape({
    id: yup.number().required(),
    title: yup.string().required("Escriba el título de la propiedad."),
    description: yup.string(),
    type: yup.number().min(1,"Selecciona una opción"),
    group: yup.number(),
    status: yup.number().min(1,"Selecciona una opción")
});

const defaultValues: TPropertyData = {
    id: 0,
    title: "",
    description: "",
    type: 0,
    group: 1,
    status: 0
}

const PropertyData: React.FC<IPropertyDataProps> = ({ id, open, setOpen, getProperties }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, formState: { errors }, reset } = useForm<TPropertyData>({ defaultValues, resolver: yupResolver(formValidations) as Resolver<TPropertyData> });
    const { isDirty } = useFormState({ control });
    const { validateResult } = useDataResponse();

    useEffect(() => {
        if (open && id > 0) {
            fetchData.get('/properties/property.php', { id }, (response: TCallBack) => {
                const data = validateResult(response.result);
                if (isNotNil(data)) {
                    reset(data);
                }
            });
        }
        return () => {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, open]);

    const onFormSubmit = (data: FieldValues) => {
        fetchData.post('/properties/property.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                setOpen({ open: false, id: 0 });
                getProperties();
            }
        });
    }

    return (<RspDialog open={open} onClose={() => setOpen({ open: false, id: 0 })}>
        <RspDialogTitle title={id > 0 ?  'EDITAR PROPIEDAD' : 'NUEVA PROPIEDAD'} onClose={() => setOpen({ open: false, id: 0 })} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={12}>
                    <Controller name="title" control={control} render={({ field }) => {
                        return <TextField id="title" label="Título de la Propiedad" type="text" {...field} {...fieldError(errors.title)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid size={12}>
                    <Controller name="description" control={control} render={({ field }) => {
                        return <TextField id="description" label="Descripción de la Propiedad" multiline maxRows={4} type="text" {...field} {...fieldError(errors.description)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="type" control={control} render={({ field }) => {
                        return <PropertiesTypeSelector {...field} {...fieldError(errors.type)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="status" control={control} render={({ field }) => {
                        return <PropertiesStatusSelector {...fieldError(errors.status)} {...field} />
                    }} />
                </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={12}>
                    <Controller name="group" control={control} render={({ field }) => {
                        return <PropertiesGroupsSelector field={field} {...fieldError(errors.type)} />
                    }} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} color='error' onClick={() => setOpen({ open: false, id: 0 })}>CANCELAR</Button>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>)
}

export default PropertyData;