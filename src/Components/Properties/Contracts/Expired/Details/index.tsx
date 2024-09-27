import { DialogContent } from '@mui/material';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import { isNotNil } from 'ramda';
import { FC, SetStateAction } from 'react';

export type TExpiredContractSummary = {
    open: boolean;
    contract?: IContract;
}

type TExpiredContractDetails = {
    setOpen: (value: SetStateAction<TExpiredContractSummary>) => void
}

const ExpiredContractDetails: FC<TExpiredContractSummary & TExpiredContractDetails> = ({ open, setOpen, contract }) => {

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="RESUMEN DE CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(contract) && <ContractDetails contract={contract} />}
        </DialogContent>
    </RspDialog>)
    
}

export default ExpiredContractDetails;