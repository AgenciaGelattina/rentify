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
    confirmed: boolean;
};

interface IPaymentsProps {
    contract: IContract;
}

const Payments: FC<IPaymentsProps> = ({ contract }) => {
    const { type } = contract;

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        {type === "recurring" && <RecurringPayments contract={contract} />}
        {type === "express" && <ExpressPayments contract={contract} />}
    </Box>)
};

export default Payments;