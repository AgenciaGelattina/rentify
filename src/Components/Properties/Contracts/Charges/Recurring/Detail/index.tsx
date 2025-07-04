import { FC } from "react";
import { ILabelStatus } from "@src/Components/LabelStatus";
import { IPaymentsData } from "../../../Payments/List";

export interface IRecurringCharge {
    id: number;
    contract: number;
    label: string;
    value: number;
    start_date: Date | string;
    end_date: Date | string;
    currency: string;
    due_date: IRecurringChargeDueDate;
    status: ILabelStatus;
    statements: IRecurringStatements;
    expired: boolean;
    canceled: boolean;
    payments?: IPaymentsData;
}

export interface IRecurringChargeDueDate {
    start: Date;
    end: Date;
    due: boolean;
    overdue: boolean;
}

export interface IRecurringStatements {
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_months: number;
    pending_payments: boolean;
}

interface IRecurringChargeDetailProps {
}

const RecurringChargeDetail: FC<IRecurringChargeDetailProps> = () => {
    return null;
}

export default RecurringChargeDetail;