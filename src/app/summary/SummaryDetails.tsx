import { DialogContent } from '@mui/material';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import ContractTabs from '@src/Components/Properties/Contracts/Details/Tabs';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { isNotNil } from 'ramda';
import { FC, SetStateAction } from 'react';

export type TSummaryDetails = {
    open: boolean;
    property?: IProperty;
    contract?: IContract;
}

type TSumaryEvents = {
    setOpen: (value: SetStateAction<TSummaryDetails>) => void
}

const SummaryDetails: FC<TSummaryDetails & TSumaryEvents> = ({ open, setOpen, property, contract }) => {

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="CONTRATO ACTIVO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(property) && <PropertyDetails {...property} />}
            {isNotNil(contract) && <ContractDetails contract={contract} showRecurringPayments={true} />}
            {isNotNil(contract) && <ContractTabs contract={contract} editMode={false} />}
        </DialogContent>
    </RspDialog>)
    
}

export default SummaryDetails;