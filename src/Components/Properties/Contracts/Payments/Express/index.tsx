import { FC, useContext, useEffect, useState } from "react";
import { IContract } from "../../Details";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import { Button } from "@mui/material";
import { LibraryAdd } from '@mui/icons-material';
import useDataResponse from "@src/Hooks/useDataResponse";
import ExpressPaymentForm, { expressPaymentFormDefault, IExpressPaymentForm } from "./Form";
import { isNotNil } from "ramda";
import PaymentsList, { IPaymentsData, paymentDataDefault } from "../List";
import { IPayment } from "..";
import { StoreContext } from "@src/DataProvider";
import { STATE_ACTIONS } from "@src/Constants";
import Header from "@src/Components/Header";

export interface IExpressPayment {
    id: number;
    label: string;
    value: number;
}

interface IExpressPaymentsProps {
    contract: IContract;
};

const ExpressPayments: FC<IExpressPaymentsProps> = ({ contract }) => {
    const { setMainState } = useContext(StoreContext);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [paymentForm, setPaymentForm] = useState<IExpressPaymentForm>(expressPaymentFormDefault);
    const [paymentsData, setPaymentsData] = useState<IPaymentsData>(paymentDataDefault);

    const getPaymentsList = () => {
        setPaymentsData(paymentDataDefault);
        fetchData.get('/properties/contracts/payments/express/payments_list.php', { contract_id: contract.id }, (response: TCallBack) => {
            const payments = validateResult(response.result);
            console.log('payments', payments);
            if (isNotNil(payments)) {
                setPaymentsData(payments);
            }
        });
    };

    useEffect(() => {
        getPaymentsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setDeletePayment = (id: number) => {
        fetchData.delete('/properties/contracts/payments/express/payment.php', { payment_id: id, contract_id: contract.id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getPaymentsList();
            }
        });
    };

    const confirmPayment = (id: number, confirmed: number) => {
        fetchData.post('/properties/contracts/payments/confirm.php', { payment_id: id, contract_id: contract.id, confirmed }, (response: TCallBack) => {
            const contract = validateResult(response.result);
            if (contract.id > 0) {
                setMainState(STATE_ACTIONS.UPDATE_CONTRACT_ON_SUMMARY, contract);
                getPaymentsList();
            };
        });
    };

    const setEditPayment = (payment: IPayment) => {
        setPaymentForm({ payment, open: true });
    };
    
    return (<>
        <Header title="PAGOS">
            <Button variant="outlined" startIcon={<LibraryAdd fontSize="inherit" color='primary' />} onClick={() => setPaymentForm({ open: true })}>
                REGISTRAR PAGO
            </Button>
        </Header>
        <PaymentsList paymentsData={paymentsData} isLoading={loading} setDeletePayment={setDeletePayment} setEditPayment={setEditPayment} confirmPayment={confirmPayment}  />
        <ExpressPaymentForm {...paymentForm} contract={contract} setOpen={setPaymentForm} getPayments={getPaymentsList} />
    </>);;
};

export default ExpressPayments;