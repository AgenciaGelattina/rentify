import { FC } from "react";
import { ILabelStatus } from "@src/Components/LabelStatus";
import { formatDate } from '@src/Utils';
import LabelTextBox from "@src/Components/LabelTextBox";
import { CURRENCY, DATE_FORMAT } from "@src/Constants";
import { Divider, Typography } from "@mui/material";

export interface IRecurringCharge {
    id: number;
    label: string;
    value: number;
    start_date: Date | string;
    end_date: Date | string;
    currency: string;
    due_date: IRecurringChargeDueDate;
    payments_status: IRecurringPaymentsStatus;
    expired: boolean;
    canceled: boolean;
}

export interface IRecurringChargeDueDate {
    start: Date;
    end: Date;
}

export interface IRecurringPaymentsStatus {
    status: ILabelStatus;
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_months: number;
}

interface IRecurringChargeDetailProps {
}

const RecurringChargeDetail: FC<IRecurringChargeDetailProps> = () => {
    return null;
}

export default RecurringChargeDetail;