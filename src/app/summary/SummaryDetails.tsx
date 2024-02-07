import { DialogContent } from '@mui/material';
import ContractDetails, { TContractDetails } from '@src/Components/Properties/Contracts/Details';
import PropertyDetails, { TPropertyDetails } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { isNotNil } from 'ramda';
import { FC, SetStateAction } from 'react';

export type TSummaryDetails = {
    open: boolean;
    property?: TPropertyDetails;
    contract?: TContractDetails;
}

type TSumaryEvents = {
    setOpen: (value: SetStateAction<TSummaryDetails>) => void
}

const SummaryDetails: FC<TSummaryDetails & TSumaryEvents> = ({ open, setOpen, property, contract }) => {

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="RESUMEN DE CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(property) && <PropertyDetails {...property} />}
            {isNotNil(contract) && <ContractDetails {...contract} />}
        </DialogContent>
    </RspDialog>)
    
}

export default SummaryDetails;