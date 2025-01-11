import { ILabelStatus } from "@src/Components/LabelStatus";
import { FC, useEffect, useState } from "react";
import { IContract } from "../../Details";
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { LibraryAdd } from '@mui/icons-material';
import useDataResponse from "@src/Hooks/useDataResponse";
import { IPayment } from "..";
import RecurringPaymentForm, { IRecurringPaymentForm, recurringPaymentFormDefault } from "./Form";
import { isNotNil } from "ramda";
import PaymentMonth from "./Months";
import PaymentsList, { IPaymentsData, paymentDataDefault } from "../List";

export interface IRecurringCharge {
    id: number;
    label: string;
    value: number;
    start_date: Date;
    end_date: Date;
};

export interface IPaymentMonth {
    date: IRecurringPaymentDate;
    due_date: string;
    payments: IPayment[];
    total_amount: number;
    required_amount: number;
    recurring_charges: IRecurringCharge[];
    status: ILabelStatus;
    is_current: boolean;
};

export interface IRecurringPaymentDate {
    year: number;
    month: number;
    year_month: string;
};

interface IRecurringPaymentsProps {
    contract: IContract;
    editMode: boolean;
};

const RecurringPayments: FC<IRecurringPaymentsProps> = ({ contract, editMode }) => {
    const { fetchData, loading, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [paymentForm, setPaymentForm] = useState<IRecurringPaymentForm>(recurringPaymentFormDefault);
    const [monthlyPayments, setMonthlyPayments] = useState<IPaymentMonth[]>([]);
    const [paymentsData, setPaymentsData] = useState<IPaymentsData>(paymentDataDefault);
    const [showMonths, setMonthsView] = useState<boolean>(true);

    const getMonthlyPayments = () => {
        setMonthlyPayments([]);
        fetchData.get('/properties/contracts/payments/recurring/payments_monthly.php', { contract_id: contract.id }, (response: TCallBack) => {
            const payments = validateResult(response.result);
            console.log('payments', payments);
            if (isNotNil(payments)) {
                setMonthlyPayments(payments);
            }
        });
    };

    const getPaymentsList = () => {
        setPaymentsData(paymentDataDefault);
        fetchData.get(`/properties/contracts/payments/recurring/payments_list.php`, { contract_id: contract.id }, (response: TCallBack) => {
            const paymentsData = validateResult(response.result);
            if (paymentsData) {
                setPaymentsData(paymentsData);
            }
        });
    };

    useEffect(() => {
        if (showMonths) {
            getMonthlyPayments();
        } else {
            getPaymentsList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMonths]);

    const removePayment = (id: number) => {
        fetchData.delete('/properties/contracts/payments/recurring/payment.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getMonthlyPayments();
            }
        });
    };

    const editPayment = (payment: IPayment) => {
        setPaymentForm({ payment, payment_date: new Date, open: true });
    };

    const setQuickPayment = (rp: IRecurringCharge, payment_date: Date = new Date) => {
        const { id, value, label } = rp;
        const payment: IPayment = {
            id: 0,
            contract: contract.id,
            recurring: { id, label },
            amount: value,
            currency: contract.currency,
            date: payment_date,
            clarifications: '',
            type: "monthly"
        }
        setPaymentForm({ payment, payment_date, open: true });
    };
    
    return (<>
        <Header title={showMonths ? "PAGOS (POR MES)" : "PAGOS"} typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            {editMode && <Button variant="outlined" startIcon={<LibraryAdd fontSize="inherit" color='primary' />} onClick={() => setPaymentForm({ payment_date: new Date, open: true })}>
                REGISTRAR PAGO
            </Button>}
        </Header>
        <Box sx={{ display: 'flex', justifyContent: 'start', padding: '1rem' }}>
            <FormControlLabel
                value="end"
                control={<Switch color="primary" checked={showMonths} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setMonthsView(e.target.checked);
                }} />}
                label={ showMonths ? "Ver Por Meses" : "Lista de Pagos" }
                labelPlacement="end"
            />
        </Box>
        {showMonths && monthlyPayments.map((payment: IPaymentMonth, ix:number) => {
            return <PaymentMonth key={`pm${ix}`} paymentData={payment} setQuickPayment={setQuickPayment} removePayment={removePayment} editPayment={editPayment} editMode={editMode } />
        })}
        {!showMonths && (<PaymentsList paymentsData={paymentsData} isLoading={loading} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />)}
        {editMode && <RecurringPaymentForm {...paymentForm} contract={contract} setOpen={setPaymentForm} getPayments={showMonths ? getMonthlyPayments : getPaymentsList} />}
    </>);
};

export default RecurringPayments;