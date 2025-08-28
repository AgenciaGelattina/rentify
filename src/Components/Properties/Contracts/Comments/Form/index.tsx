import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useDataResponse from "@src/Hooks/useDataResponse";
import { FC, useContext, useEffect } from "react";
import { IComment } from '../Comment';
import { Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { fieldError } from '@src/Utils';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import { isNil, isNotNil } from 'ramda';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { StoreContext } from '@src/DataProvider';

export type TCommentsForm = {
    comment?: IComment;
    open: boolean;
}

interface ICommentData {
    id: number;
    text: string;
}

const formValidations = yup.object().shape({
    id: yup.number().required(),
    text: yup.string().required("Por favor escriba un comentario")
});

const defaultComment: ICommentData = {
    id: 0,
    text: ""
}

interface ICommentsFormProps extends TCommentsForm{
    property: { id: number };
    contract: { id: number };
    getComments: () => void;
    setCommentsForm: (commentForm: TCommentsForm) => void;
};

const CommentsForm: FC<ICommentsFormProps> = ({ open, property, contract, comment, getComments, setCommentsForm }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, formState: { errors }, reset } = useForm({ defaultValues: defaultComment, resolver: yupResolver(formValidations) });
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (isNotNil(comment)) {
            reset({ id: comment.id, text: comment.text });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment]);

    const onFormSubmit = (data: FieldValues) => {
        const dataToSave = { ...data, contract: contract.id, property: property.id, account: user.id };
        fetchData.post('/properties/contracts/comments/comment.php', dataToSave, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                getComments();
                reset(defaultComment);
            }
        });
    };

    return (<RspDialog open={open} maxWidth="sm" onClose={() => setCommentsForm({ open: false })} >
        <RspDialogTitle title={isNil(comment) ?  'NUEVO COMENTARIO' :  'EDITAR COMENTARIO'} onClose={() => setCommentsForm({ open: false })} />
        <DialogContent>
            <Controller name="text" control={control} render={({ field }) => {
                return <TextField id="text" label="Comentario:" multiline {...field} {...fieldError(errors.text)} onChange={(e) => field.onChange(e)} fullWidth />
            }} />
        </DialogContent>
        <DialogActions>
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>GUARDAR</Button>
        </DialogActions>
    </RspDialog>);
}

export default CommentsForm;