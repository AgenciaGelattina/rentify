import { FC, useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, IconButton, Switch } from '@mui/material';
import { LibraryAdd } from '@mui/icons-material';
import { ConditionalRender, Header, TCallBack, useFetchData } from '@phoxer/react-components';
import PaymentMonth from './Months';
import useDataResponse from '@src/Hooks/useDataResponse';
import PaymentForm, { TPaymentForm } from './PaymentForm';
import { getUIKey } from '@src/Utils';
import PaymentsTable from './Months/PaymentsTable';
import { ILabelStatus } from '@src/Components/LabelStatus';
import { IContract } from '../Details';

type TContractPayments = {
    contract: IContract;
    editMode: boolean;
}

export interface IPaymentDate {
    year: number;
    month: number;
    year_month: string;
}

export interface IPayment {
    id: number;
    contract: number;
    recurring: { id: number, label: string };
    type: { id: number, label: string };
    amount: number;
    date: Date;
    clarifications: string;
    created?: Date | null;
    updated?: Date | null;
}

export interface IPaymentMonth {
    date: IPaymentDate;
    due_date: string;
    payments: IPayment[];
    total_amount: number;
    required_amount: number;
    status: ILabelStatus;
    is_current: boolean;
}

const ContractPayments: FC<TContractPayments> = ({ contract, editMode = false }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [paymentForm, setPaymentForm] = useState<TPaymentForm>({ contract, payment_date: new Date, open: false });
    const [showMonths, setMonthsView] = useState<boolean>(true);
    const [payments, setPayments] = useState<IPaymentMonth[]>([]);

    const getPayments = () => {
        fetchData.get('/properties/contracts/payments/payments_monthly.php', { contract_id: contract.id }, (response: TCallBack) => {
            const payments = validateResult(response.result);
            if (payments) {
                setPayments(payments);
            }
        });
    }

    const removePayment = (id: number) => {
        fetchData.delete('/properties/contracts/payments/payment.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getPayments();
            }
        });
    }

    const editPayment = (payment: IPayment) => {
        setPaymentForm({ payment, contract, payment_date: new Date, open: true });
    }
    
    useEffect(() => {
        getPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        <Header title="PAGOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            {editMode && <Button variant="outlined" startIcon={<LibraryAdd fontSize="inherit" color='primary' />} onClick={() => setPaymentForm({ contract, payment_date: new Date, open: true })}>
                REGISTRAR PAGO
            </Button>}
        </Header>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <FormControlLabel
            value="end"
            control={<Switch color="primary" checked={showMonths} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMonthsView(e.target.checked);
            }} />}
            label={ showMonths ? "Meses Activos" : "Lista de Pagos" }
            labelPlacement="end"
            />
        </Box>
        <ConditionalRender condition={!showMonths}>
            <PaymentsTable contract={contract} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />
        </ConditionalRender>
        <ConditionalRender condition={showMonths}>
            {payments && payments.map((payment) => {
                return <PaymentMonth key={getUIKey()} contract={contract} paymentData={payment} removePayment={removePayment} editPayment={editPayment} editMode={editMode } />
            })}
        </ConditionalRender>
        {editMode && <PaymentForm {...paymentForm} setOpen={setPaymentForm} getPayments={getPayments} />}
    </Box>)
}

export default ContractPayments; 