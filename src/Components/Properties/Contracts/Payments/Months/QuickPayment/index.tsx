import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";
import { IRecurringPayment } from "../..";

interface IQuickPayments {
    recurring_payments: IRecurringPayment[];
    setQuickPayment: (payment: IRecurringPayment, due_date: Date) => void;
    due_date: string;
}

const QuickPayments: FC<IQuickPayments> = ({ recurring_payments, setQuickPayment, due_date }) => {
    return (<Box>
        <Stack spacing={1} direction="row">
            {recurring_payments.map((rp: IRecurringPayment) => {
                return <Button key={`rq.${rp.id}`} onClick={() => setQuickPayment(rp, new Date(due_date))} variant="contained">{rp.label}</Button>;
            })}
        </Stack>
    </Box>);
}

export default QuickPayments;