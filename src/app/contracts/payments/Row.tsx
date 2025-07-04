import { FC, useMemo, useState } from "react";
import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import QuickPayments from "@src/Components/QuickPayments";
import { IPaymentCollection } from "./Details";
import { IPayment } from "@src/Components/Properties/Contracts/Payments";
import RecurringPaymentForm, { IRecurringPaymentForm, recurringPaymentFormDefault } from "@src/Components/Properties/Contracts/Payments/Recurring/Form";
import ExpressPaymentForm, { expressPaymentFormDefault, IExpressPaymentForm } from "@src/Components/Properties/Contracts/Payments/Express/Form";
import { dateIsExpired } from "@src/Utils";
import { IContractor } from "@src/Components/Properties/Contracts/Contractors/Details";

interface IPaymentCollectionRowProps {
    paymentCollection: IPaymentCollection;
    selectedDate: Date;
    getPaymentCollectionData: () => void;
};

const PaymentCollectionRow: FC<IPaymentCollectionRowProps> = ({ paymentCollection, selectedDate, getPaymentCollectionData }) => {
    const { property, contract } = paymentCollection;
    const { contractors, due_date } = contract;
    const [recurringPaymentForm, setRecurringPaymentForm] = useState<IRecurringPaymentForm>(recurringPaymentFormDefault);
    const [expressPaymentForm, setExpressPaymentForm] = useState<IExpressPaymentForm>(expressPaymentFormDefault);
    //const [showContractDetails, setShowContractDetails] = useState<boolean>(false);
    const isExpress: boolean = contract.type === 'express';

    const setQuickPayment = (payment: IPayment) => {
        if (isExpress) {
            setExpressPaymentForm({ payment, open: true });
        } else {
            setRecurringPaymentForm({ payment, open: true });
        }
    };

    const setEditPayment = (payment: IPayment) => {
        if (isExpress) {
            setExpressPaymentForm({ payment, open: true });
        } else {
            setRecurringPaymentForm({ payment, open: true });
        }
    }

    const contractor: IContractor | null = useMemo(() => {
        return (contractors && contractors?.length > 0) ? contractors[0] : null;
    }, [contractors]);

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{property.title}</Typography>
                <Stack spacing={0}>
                    {contractor && <Typography variant="caption">{contractor.names}</Typography>}
                    <Typography variant="caption" color={dateIsExpired(due_date.start) ? 'error' : 'success'}>{`${due_date.day} del Mes`}</Typography>
                </Stack>
            </TableCell>
            <TableCell component="td" scope="row">
                <QuickPayments contract={contract} setQuickPayment={setQuickPayment} setEditPayment={setEditPayment} selectedDate={selectedDate} />
            </TableCell>
        </TableRow>
        {isExpress ? <ExpressPaymentForm {...expressPaymentForm} contract={contract} setOpen={setExpressPaymentForm} getPayments={getPaymentCollectionData} /> : <RecurringPaymentForm {...recurringPaymentForm} contract={contract} setOpen={setRecurringPaymentForm} getPayments={getPaymentCollectionData} />}
    </>);
};

export default PaymentCollectionRow;