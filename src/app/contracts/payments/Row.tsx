import { FC, useMemo, useState } from "react";
import { Box, Button, Divider, IconButton, List, MenuList, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { Event, Comment, Person } from "@mui/icons-material";
import QuickPayments from "@src/Components/QuickPayments";
import ContractPaymentDetails, { IContractPaymentDetails, IPaymentCollection } from "./Details";
import { IPayment } from "@src/Components/Properties/Contracts/Payments";
import RecurringPaymentForm, { IRecurringPaymentForm, recurringPaymentFormDefault } from "@src/Components/Properties/Contracts/Payments/Recurring/Form";
import ExpressPaymentForm, { expressPaymentFormDefault, IExpressPaymentForm } from "@src/Components/Properties/Contracts/Payments/Express/Form";
import { dateIsExpired } from "@src/Utils";
import { IContractor } from "@src/Components/Properties/Contracts/Contractors/Details";
import ListItem, { IListItem } from "@src/Components/Navigation/List/ListItem/ListItem";
import { isNotNil } from "ramda";

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
    const [showContractDetails, setShowContractDetails] = useState<IContractPaymentDetails>({ open: false });
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

   const itemSx = { display: 'flex', justifyItems: 'center', cursor: 'pointer' }
    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{property.title}</Typography>
                <Divider/>
                <Stack direction="column" alignItems="start" spacing={0}>  
                    <Button variant="text" color={dateIsExpired(due_date.start) ? 'error' : 'success'} startIcon={<Event fontSize="inherit" />}>
                        {`${due_date.day} del Mes`}
                    </Button>
                    <Button size='small' variant="text" sx={{fontSize: '10px'}} startIcon={<Person fontSize="inherit" />} onClick={() => setShowContractDetails({ open: true })}>
                        {`${contractor?.names} ${contractor?.surnames}`}
                    </Button>
                    <Button size='small' variant="text" sx={{fontSize: '10px'}} startIcon={<Comment fontSize="inherit" />} onClick={() => setShowContractDetails({ open: true })}>
                        Comentarios
                    </Button>
                </Stack>
            </TableCell>
            <TableCell component="td" scope="row">
                <QuickPayments contract={contract} setQuickPayment={setQuickPayment} setEditPayment={setEditPayment} selectedDate={selectedDate} />
            </TableCell>
        </TableRow>
        {isExpress ? <ExpressPaymentForm {...expressPaymentForm} contract={contract} setOpen={setExpressPaymentForm} getPayments={getPaymentCollectionData} /> : <RecurringPaymentForm {...recurringPaymentForm} contract={contract} setOpen={setRecurringPaymentForm} getPayments={getPaymentCollectionData} />}
        <ContractPaymentDetails {...showContractDetails} property={property} contract={contract} setShowContractDetails={setShowContractDetails} />
    </>);
};

export default PaymentCollectionRow;