import { DialogContent } from '@mui/material';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import ContractTabs from '@src/Components/Properties/Contracts/Details/Tabs';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react';

interface ISummaryDetailsProps {
    property: IProperty;
    contract: IContract;
    open: boolean;
    setClose: Dispatch<SetStateAction<boolean>>
}

const SummaryDetails: FC<ISummaryDetailsProps> = ({ property, contract, open, setClose }) => {
    return (<RspDialog open={open} onClose={() => setClose(false)}>
        <RspDialogTitle title="CONTRATO" onClose={() => setClose(false)} />
        <DialogContent>
            <PropertyDetails property={property} />
            <ContractDetails contract={contract} expanded={true} />
            <ContractTabs contract={contract} property={property}  />
        </DialogContent>
    </RspDialog>);
}

export default SummaryDetails;