import { DialogContent } from "@mui/material";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import { FC } from "react";

export interface IContractor {
    id: number;
    names: string;
    surnames: string;
    email: string;
    phone: string;
};

export interface IContractorDetails {
    open: boolean;
    contractor?: IContractor;
}

interface IContractorDetailsProps extends IContractorDetails {
    setOpen: (contractorDetails: IContractorDetails) => void;
}

const ContractorDetails: FC<IContractorDetailsProps> = ({ open, contractor, setOpen }) => {
    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="DATOS DE CONTACTO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
        </DialogContent>
    </RspDialog>)
};

export default ContractorDetails;