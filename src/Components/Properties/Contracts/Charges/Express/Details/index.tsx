import { FC } from "react";
import Grid from '@mui/material/Grid2';
import { IContract } from "../../../Details";
import LabelStatus, { ILabelStatus } from "@src/Components/LabelStatus";
import { formatDate } from '@src/Utils';
import LabelTextBox from "@src/Components/LabelTextBox";
import { CURRENCY, DATE_FORMAT } from "@src/Constants";
import { Divider, Typography } from "@mui/material";

export interface IExpressCharge {
    id: number;
    label: string;
    value: number;
    start_date: Date;
    end_date: Date;
    currency: string;
    status: ILabelStatus;
    statements: IExpressStatements;
    expired: boolean;
    canceled: boolean;
}

export interface IExpressStatements {
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_days: number;
}

interface IExpressChargeDetailProps {
    
}

const ExpressChargeDetail: FC<IExpressChargeDetailProps> = () => {
    return null;
}

export default ExpressChargeDetail;