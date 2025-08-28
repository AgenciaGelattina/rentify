import { FC, useEffect } from 'react';
import { Alert, Button, DialogActions, DialogContent, Divider } from '@mui/material';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import TabsContent from '@src/Components/TabsContent';
import ContractData from './ContractData';
import ExpiredContracts from '@src/Components/Properties/Contracts/Expired';
import FinalizedContracts from '@src/Components/Properties/Contracts/Finalized';
import { isNotNil } from 'ramda';
import AccountSelector from '@src/Components/Forms/AccountSelector';
import { Controller, FieldValues, useForm, useFormState } from 'react-hook-form';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Assignment } from '@mui/icons-material';

export interface IAccountAssignment {
    open: boolean;
    property?: IProperty;
}

interface IAccountAssignmentProps extends IAccountAssignment {
    setOpen: (accountAssignment: IAccountAssignment) => void;
    getProperties: () => void;
};

const AccountAssignment: FC<IAccountAssignmentProps> = ({ property, open, setOpen, getProperties }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { control, handleSubmit, reset, watch } = useForm<FieldValues>({ defaultValues: { account: 0 } });
    const { isDirty } = useFormState({ control });
    const isAssigned = watch('account') || isNotNil(property?.assignment);

    useEffect(() => {
        if (property && property?.assignment) {
            reset({ account: property.assignment.id });
        } else {
            reset({ account: 0 });
        }
    }, [property]);
    
    const onFormSubmit = (data: FieldValues) => {
        if (isNotNil(property)) {
            const { account } = data;
            fetchData.post('/properties/assignment/account.php', { account, property: property.id } , (response: TCallBack) => {
                const saved = validateResult(response.result);
                if (saved) {
                    reset({ account: 0 });
                    setOpen({ open: false });
                    getProperties();
                }
            });
        };
    };
        
    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title={`ASIGNACIÓN DE: ${property?.title}`} onClose={() => setOpen({ open: false })} />
        <DialogContent>
            <Controller name="account" control={control} render={({ field }) => {
                return <AccountSelector {...field} />
            }} />
            
            <Divider />
        </DialogContent>
        <DialogActions>
            <Button disabled={loading} color='error' onClick={() => setOpen({ open: false })}>CANCELAR</Button>
            <Button disabled={!isDirty || loading} onClick={handleSubmit((data) => onFormSubmit(data))}>
                {`${isAssigned ? `ASIGNAR`:`DESASIGNAR`} PROPIEDAD`}
            </Button>
        </DialogActions>
    </RspDialog>)
};
/*
interface IAlertAssignmentStatus {
    isAssigned: boolean;
    assignment: 
}

const AlertAssignmentStatus: FC<IAlertAssignmentStatus> = ({ isAssigned, assignment }) => {

    return ({isAssigned && <Alert sx={{ marginBottom: '1rem'}} icon={<Assignment fontSize="inherit" />} severity="success">
                {`La propiedad se encuentra asignada a ${property?.assignment.name}`}
            </Alert>}
            <Alert sx={{ marginBottom: '1rem'}} icon={<Assignment fontSize="inherit" />} severity="info">
                Al asignar la propiedad a un cobrador le aparecerá en la lista de cobranza.
            </Alert>)
}

*/

export default AccountAssignment;