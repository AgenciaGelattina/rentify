import { FC, useContext, useMemo, useState } from "react";
import { TCharge } from "@src/Components/Properties/Contracts/Charges";
import { Alert, AlertTitle, Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { IPayment, TPaymentType } from "@src/Components/Properties/Contracts/Payments";
import { formatToMoney, mapKey, showOnRoles } from "@src/Utils";
import { isNotNil } from "ramda";
import { AddCard, Check } from "@mui/icons-material";
import { IContract, TContractType } from "@src/Components/Properties/Contracts/Details";
import ChargePayments from "./Payments";
import { StoreContext } from "@src/DataProvider";

interface IChargeBoxProps {
    charge: TCharge;
    selectedDate: Date;
    contract: IContract;
    loading: boolean | null;
    expandPayments?: boolean;
    setQuickPayment: (payment: IPayment) => void;
    setEditPayment: (payment: IPayment) => void;
};

const ChargeBox: FC<IChargeBoxProps> = ({ charge, selectedDate, contract, loading, expandPayments = false, setQuickPayment, setEditPayment }) => {
    const { state: { user } } = useContext(StoreContext);
    const { id, label, statements, currency, status, payments } = charge;
    const { pending_payments, pending_amount, total_amount } = statements;
    const [showPaymentsList, setShowPaymentList] = useState<boolean>(false);

    const paymentType: TPaymentType = useMemo(() => {
        return id > 0 ? (contract.type === 'express' ? 'unique' : 'monthly') : "extraordinary"
    }, [id, contract]);

    const handleQuickPayment = () => {
        const quickPaymentData: IPayment = {
            id: 0,
            type: paymentType,
            date: selectedDate,
            contract: contract.id,
            clarifications: "",
            amount: pending_amount,
            currency: currency,
            confirmed: showOnRoles(user, [1,2])
        };
        if (contract.type === 'express') {
            quickPaymentData.express = { id, label }
        } else if(contract.type === 'recurring') {
            quickPaymentData.recurring = { id, label }
        }
        setQuickPayment(quickPaymentData);
    };

    const handleEditPayment = (payment: IPayment) => {
        const editPaymentData: IPayment = {
            ...payment,
            type: paymentType,
        };
        if (contract.type === 'express') {
            editPaymentData.express = { id, label }
        } else if(contract.type === 'recurring') {
            editPaymentData.recurring = { id, label }
        }
        setEditPayment(editPaymentData);
    }

    const totalPaymentsLabel = useMemo(() => {
        const totalAmount = formatToMoney(total_amount, currency);
        if (isNotNil(payments) && payments.payments.length > 0) {
            return `${payments.payments.length} | ${totalAmount}`;
        };
        return totalAmount;
    }, [total_amount, payments, currency]);
    

    if (pending_payments) {
        const showPending = (pending_amount > 0);
        return (<Paper elevation={1} sx={{ minWidth: 200, padding: '.4rem .6rem', backgroundColor: `${status.severity}.main`, color: `${status.severity}.contrastText` }}>
            <Box sx={{ cursor: 'pointer', display:'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={handleQuickPayment}>
                <Box>
                    <Typography sx={{ marginLeft: '.3rem', marginBottom: showPending ? '-0.5rem' : '0' }} variant="subtitle2">{label}</Typography>
                    {showPending && <Typography sx={{ marginLeft: '.3rem' }} variant="caption">{formatToMoney(pending_amount, currency)}</Typography>}
                </Box>
                <AddCard sx={{ marginLeft: '.3rem' }} fontSize="medium"  />
            </Box>
            <Divider sx={{ margin: '.2rem 0' }} />
            <ChargePayments paymentsData={payments} currency={currency} setEditPayment={handleEditPayment} />
        </Paper>);
    };

    return (<Paper elevation={1} sx={{ minWidth: 200, cursor: 'pointer', padding: '.4rem .6rem', backgroundColor: `success.main`, color: `success.contrastText` }} >
        <Typography sx={{ marginLeft: '.3rem' }} variant="subtitle2">{label}</Typography>
        <Divider sx={{ marginTop: '.5rem' }} />
        {showPaymentsList && <ChargePayments paymentsData={payments} currency={currency} setEditPayment={handleEditPayment} />}
        {!showPaymentsList && <Button variant="text" color="inherit" onClick={() => setShowPaymentList(true)} fullWidth>{totalPaymentsLabel}</Button>}
    </Paper>);
};

export default ChargeBox; 

