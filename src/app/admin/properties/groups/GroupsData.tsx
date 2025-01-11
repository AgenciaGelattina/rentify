import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm, Controller, useFormState, FieldValues } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { DialogContent, DialogActions, TextField, Button, Divider, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { fieldError } from '@src/Utils';
import { isNotNil } from 'ramda';
import GroupsTypeSelector from '@src/Components/Forms/GroupsType';

export interface IGroupData {
    group: TGroupData;
    open: boolean;
}

interface IGroupDataProps extends IGroupData {
    setGroupData:  Dispatch<SetStateAction<IGroupData>>;
    getGroups: () => void;
}

export type TGroupData = {
    id: number;
    title: string;
    type: number;
    description?: string;
    address?: string;
    active: number;
    properties?: number;
}

const defaultValues: TGroupData = {
    id: 0,
    title: "",
    type: 0,
    description: "",
    address: "",
    active: 1,
    properties: 0
}
export const defaultGroupDataState: IGroupData = { open: false, group: defaultValues };

const formValidations = yup.object().shape({
    id: yup.number().required(),
    title: yup.string().required("Escriba el título del grupo."),
    type: yup.number(),
    description: yup.string(),
    address: yup.string(),
    active: yup.number()
});

const GroupData: React.FC<IGroupDataProps> = ({ group, open, setGroupData, getGroups }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });
    const { validateResult } = useDataResponse();

    useEffect(() => {
        if (open && group.id > 0) {
            reset(group);
        }
        return () => {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group, open]);

    const onFormSubmit = (data: FieldValues) => {
        fetchData.post('/properties/groups/group.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                setGroupData(defaultGroupDataState);
                getGroups();
            }
        });
    }

    return (<RspDialog open={open} maxWidth="sm" onClose={() => setGroupData(defaultGroupDataState)}>
        <RspDialogTitle title={group.id > 0 ?  'EDITAR GRUPO DE PROPIEDADES' : 'NUEVO GRUPO DE PROPIEDADES'} onClose={() => setGroupData(defaultGroupDataState)} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={12}>
                    <Controller name="title" control={control} render={({ field }) => {
                        return <TextField id="title" label="Título del Grupo de Propiedades" type="text" {...field} {...fieldError(errors.title)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                    {isNotNil(group.properties) && (<Typography variant="caption">{`Numero de propiedades: ${group.properties}`}</Typography>)}
                </Grid>
                <Grid size={12}>
                    <Controller name="type" control={control} render={({ field }) => {
                        return <GroupsTypeSelector {...field} {...fieldError(errors.type)} />
                    }} />
                </Grid>
                <Grid size={12}>
                    <Controller name="address" control={control} render={({ field }) => {
                        return <TextField id="address" label="Dirección física" type="text" {...field} {...fieldError(errors.title)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
                <Grid size={12}>
                    <Controller name="description" control={control} render={({ field }) => {
                        return <TextField id="description" label="Descripción del Grupo" type="text" {...field} multiline {...fieldError(errors.title)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} color='error' onClick={() => setGroupData(defaultGroupDataState)}>CANCELAR</Button>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>)
}

export default GroupData;