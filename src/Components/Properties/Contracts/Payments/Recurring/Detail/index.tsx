import { ILabelStatus } from "@src/Components/LabelStatus";
import { FC } from "react";


export interface IRecurring {
    id: number;
    label: string;
    value: number;
    start_date: Date | string;
    end_date: Date | string;
    expired: boolean;
    currency: string;
    due_date: IRecurringPaymentDueDate;
    payment_status: IRecurringPaymentStatus;
    canceled: boolean;
}

export interface IRecurringPaymentDueDate {
    start: Date;
    end: Date;
}

export interface IRecurringPaymentStatus {
    status: ILabelStatus;
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_months: number;
}

const RecurringPaymentDetail: FC = () => {

    return null;

}

export default RecurringPaymentDetail;