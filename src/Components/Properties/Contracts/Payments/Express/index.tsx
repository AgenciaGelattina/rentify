import { FC, useContext, useEffect, useState } from "react";
import { IContract } from "../../Details";
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import { Button } from "@mui/material";
import { LibraryAdd } from '@mui/icons-material';
import useDataResponse from "@src/Hooks/useDataResponse";
import ExpressPaymentForm, { IExpressPaymentForm } from "./Form";
import { isNotNil } from "ramda";
import PaymentsList, { IPaymentsData, paymentDataDefault } from "../List";
import { IPayment } from "..";
import { StoreContext } from "@src/DataProvider";
import { STATE_ACTIONS } from "@src/Constants";

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
    const [paymentForm, setPaymentForm] = useState<IExpressPaymentForm>({ payment_date: new Date, open: false });
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

    const removePayment = (id: number) => {
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

    const editPayment = (payment: IPayment) => {
        setPaymentForm({ payment, payment_date: new Date, open: true });
    };
    
    return (<>
        <Header title="PAGOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            <Button variant="outlined" startIcon={<LibraryAdd fontSize="inherit" color='primary' />} onClick={() => setPaymentForm({ payment_date: new Date, open: true })}>
                REGISTRAR PAGO
            </Button>
        </Header>
        <PaymentsList paymentsData={paymentsData} isLoading={loading} removePayment={removePayment} editPayment={editPayment} confirmPayment={confirmPayment}  />
        <ExpressPaymentForm {...paymentForm} contract={contract} setOpen={setPaymentForm} getPayments={getPaymentsList} />
    </>);;
};

export default ExpressPayments;