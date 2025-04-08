import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";
import { IRecurringCharge} from "../..";

interface IQuickPayments {
    recurring_charges: IRecurringCharge[];
    setQuickPayment: (recurring_charge: IRecurringCharge, due_date: Date) => void;
    due_date: string;
}

const QuickPayments: FC<IQuickPayments> = ({ recurring_charges, setQuickPayment, due_date }) => {
    console.log('QuickPayments', recurring_charges);
    return (<Box>
        <Stack spacing={1} direction="row">
            {recurring_charges.map((rp: IRecurringCharge) => {
                return <Button key={`rq.${rp.id}`} onClick={() => setQuickPayment(rp, new Date(due_date))} variant="contained">{rp.label}</Button>;
            })}
        </Stack>
    </Box>);
}

export default QuickPayments;