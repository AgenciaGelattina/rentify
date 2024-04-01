import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, FormControlLabel, IconButton, Switch } from '@mui/material';
import { LibraryAdd } from '@mui/icons-material';
import { ConditionalRender, Header, TCallBack, useFetchData } from '@phoxer/react-components';
import PaymentMonth from './Months';
import useDataResponse from '@src/Hooks/useDataResponse';
import PaymentForm, { TPaymentForm } from './PaymentForm';
import { getUIKey } from '@src/Utils';
import PaymentsTable from './Months/PaymentsTable';

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
    const [showMonths, setMonthsView] = useState<boolean>(true);
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

    const getPaymentsList = useMemo(() => {
        let paymentsList: IPayment[] = [];
        let totalAmount: number = 0;
        payments.forEach((payment: IPaymentMonth) => {
            totalAmount += payment.total_amount;
            paymentsList = [ ...paymentsList, ...payment.payments ];
        })
        return { payments: paymentsList, totalAmount };
    }, [payments]);
    
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
            <PaymentsTable payments={getPaymentsList.payments} total_amount={getPaymentsList.totalAmount} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />
        </ConditionalRender>
        <ConditionalRender condition={showMonths}>
            {payments && payments.map((payment) => {
                return <PaymentMonth key={getUIKey()} paymentData={payment} removePayment={removePayment} editPayment={editPayment} editMode={editMode } />
            })}
        </ConditionalRender>
        {editMode && <PaymentForm {...paymentForm} setOpen={setPaymentForm} getPayments={getPayments} />}
    </Box>)
}

export default ContractPayments; 