import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm, Controller, useFormState, FieldValues } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { DialogContent, DialogActions, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { fieldError } from '@src/Utils';


export interface ITypeData {
    type: TTypeData;
    open: boolean;
}

interface ITypeDataProps extends ITypeData {
    setTypeData:  Dispatch<SetStateAction<ITypeData>>;
    getTypes: () => void;
}

export type TTypeData = {
    id: number;
    label: string;
}

const defaultValues: TTypeData = {
    id: 0,
    label: ""
}
export const defaultTypeDataState: ITypeData = { open: false, type: defaultValues };

const formValidations = yup.object().shape({
    id: yup.number().required(),
    label: yup.string().required("Escriba el typo del propiedad."),
});

const TypeData: React.FC<ITypeDataProps> = ({ type, open, setTypeData, getTypes }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { handleSubmit, control, formState: { errors }, reset } = useForm({ defaultValues, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });
    const { validateResult } = useDataResponse();

    useEffect(() => {
        if (open && type.id > 0) {
            reset(type);
        }
        return () => {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, open]);

    const onFormSubmit = (data: FieldValues) => {
        fetchData.post('/properties/groups/types/type.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                setTypeData(defaultTypeDataState);
                getTypes();
            }
        });
    }

    return (<RspDialog open={open} maxWidth="sm" onClose={() => setTypeData(defaultTypeDataState)}>
        <RspDialogTitle title={type.id > 0 ?  'EDITAR TIPO' : 'NUEVO TIPO'} onClose={() => setTypeData(defaultTypeDataState)} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid xs={12}>
                    <Controller name="label" control={control} render={({ field }) => {
                        return <TextField id="title" label="Tipo de grupo de propiedad" type="text" {...field} {...fieldError(errors.label)} onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} color='error' onClick={() => setTypeData(defaultTypeDataState)}>CANCELAR</Button>
          <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>)
}

export default TypeData;