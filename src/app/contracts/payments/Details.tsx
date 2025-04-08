import { DialogContent } from '@mui/material';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import Payments from '@src/Components/Properties/Contracts/Payments';
import { StoreContext } from '@src/DataProvider';
import { isNotNil } from 'ramda';
import { Dispatch, FC, SetStateAction, useContext } from 'react';
import { STATE_ACTIONS } from '@src/Constants';

interface IPaymentCollectionDetailsProps {
    property: IProperty;
    contract: IContract;
    open: boolean;
    setClose: Dispatch<SetStateAction<boolean>>
}

const PaymentCollectionDetails: FC<IPaymentCollectionDetailsProps> = ({ property, contract, open, setClose }) => {
    return (<RspDialog open={open} onClose={() => setClose(false)}>
        <RspDialogTitle title="" onClose={() => setClose(false)} />
        <DialogContent>
            <PropertyDetails property={property} />
            <ContractDetails contract={contract} expanded={true} />
            <Payments contract={contract}  />
        </DialogContent>
    </RspDialog>);
};

export default PaymentCollectionDetails;