import { FC } from "react";
import { IContract } from "../Details";
import { Box } from "@mui/material";
import RecurringPayments from "./Recurring";
import ExpressPayments from "./Express";

export type TPaymentType = "unique" | "monthly" | "extraordinary";

export interface IPayment {
    id: number;
    contract: number;
    amount: number;
    currency: string;
    date: Date;
    clarifications: string;
    type: TPaymentType;
    recurring?: { id: number, label: string };
    express?: { id: number, label: string };
};

interface IPaymentsProps {
    contract: IContract;
    editMode: boolean;
}

const Payments: FC<IPaymentsProps> = ({ contract, editMode = false }) => {
    const { type } = contract;

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        {type === "recurring" && <RecurringPayments contract={contract} editMode={editMode} />}
        {type === "express" && <ExpressPayments contract={contract} editMode={editMode} />}
    </Box>)
};

export default Payments;