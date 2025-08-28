import { DialogContent } from '@mui/material';
import ContractComments from '@src/Components/Properties/Contracts/Comments';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { Dispatch, FC, SetStateAction, useContext } from 'react';

export interface IPaymentCollection {
    contract: IContract;
    property: IProperty;
}

export interface IContractPaymentDetails {
    open: boolean;
}

interface IContractPaymentDetailsProps extends IContractPaymentDetails {
    contract: IContract;
    property: IProperty;
    setShowContractDetails: Dispatch<SetStateAction<IContractPaymentDetails>>
}

const ContractPaymentDetails: FC<IContractPaymentDetailsProps> = ({ property, contract, open, setShowContractDetails }) => {
    return (<RspDialog open={open} onClose={() => setShowContractDetails({ open: false })}>
        <RspDialogTitle title="DETALLES DE CONTRATO" onClose={() => setShowContractDetails({ open: false })} />
        <DialogContent>
            <PropertyDetails property={property} />
            <ContractDetails contract={contract} expanded={true} />
            <ContractComments property={property} contract={contract} />
        </DialogContent>
    </RspDialog>);
};

export default ContractPaymentDetails;