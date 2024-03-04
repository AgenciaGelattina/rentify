import { FC, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { LibraryAdd } from '@mui/icons-material';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import PaymentMonth from './Months';
import useDataResponse from '@src/Hooks/useDataResponse';
import PaymentForm, { TPaymentForm } from './PaymentForm';
import { getUIKey } from '@src/Utils';

type TContractPayments = {
    contract: { id: number };
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
    type: { id: number, label: string };
    amount: number;
    date: Date | null;
    clarifications: string;
}

export interface IPaymentMonth {
    date: IPaymentDate;
    due_date: string;
    payments: IPayment[];
    total_amount: number;
    in_debt: boolean;
    is_current: boolean;
}

const ContractPayments: FC<TContractPayments> = ({ contract, editMode = false }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [paymentForm, setPaymentForm] = useState<TPaymentForm>({ contract_id: contract.id, open: false });
    const [payments, setPayments] = useState<IPaymentMonth[]>([]);

    const getPayments = ( ) => {
        fetchData.get('/properties/contracts/payments/payments.php', { contract_id: contract.id }, (response: TCallBack) => {
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
        setPaymentForm({ payment, contract_id: contract.id, open: true });
    }
    
    useEffect(() => {
        getPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        <Header title="PAGOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            {editMode && <IconButton onClick={() => setPaymentForm({ contract_id: contract.id, open: true })}>
                <LibraryAdd fontSize="inherit" color='primary' />
            </IconButton>}
        </Header>
        {payments && payments.map((payment) => {
            return <PaymentMonth key={getUIKey()} paymentData={payment} removePayment={removePayment} editPayment={editPayment} editMode={editMode } />
        })}
        {editMode && <PaymentForm {...paymentForm} setOpen={setPaymentForm} getPayments={getPayments} />}
    </Box>)
}

export default ContractPayments;