import { FC } from "react";
import { ILabelStatus } from "@src/Components/LabelStatus";
import { IPaymentsData } from "../../../Payments/List";

export interface IExpressCharge {
    id: number;
    contract: number;
    label: string;
    value: number;
    start_date: Date;
    end_date: Date;
    currency: string;
    status: ILabelStatus;
    statements: IExpressStatements;
    expired: boolean;
    canceled: boolean;
    payments?: IPaymentsData;
}

export interface IExpressStatements {
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_days: number;
    pending_payments: boolean;
}

interface IExpressChargeDetailProps {
    
}

const ExpressChargeDetail: FC<IExpressChargeDetailProps> = () => {
    return null;
}

export default ExpressChargeDetail;