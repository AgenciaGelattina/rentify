import { ILabelStatus } from "@src/Components/LabelStatus";
import { FC, useEffect, useState } from "react";
import { IContract } from "../../Details";
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import { Button } from "@mui/material";
import { LibraryAdd } from '@mui/icons-material';
import useDataResponse from "@src/Hooks/useDataResponse";
import ExpressPaymentForm, { IExpressPaymentForm } from "./Form";
import { isNotNil } from "ramda";
import PaymentsList, { IPaymentsData, paymentDataDefault } from "../List";
import { IPayment } from "..";

export interface IExpressPayment {
    id: number;
    label: string;
    value: number;
}

interface IExpressPaymentsProps {
    contract: IContract;
    editMode: boolean;
};

const ExpressPayments: FC<IExpressPaymentsProps> = ({ contract, editMode }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
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
        fetchData.delete('/properties/contracts/payments/recurring/payment.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getPaymentsList();
            }
        });
    }

    const editPayment = (payment: IPayment) => {
        setPaymentForm({ payment, payment_date: new Date, open: true });
    }
    
    return (<>
        <Header title="PAGOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            {editMode && <Button variant="outlined" startIcon={<LibraryAdd fontSize="inherit" color='primary' />} onClick={() => setPaymentForm({ payment_date: new Date, open: true })}>
                REGISTRAR PAGO
            </Button>}
        </Header>
        <PaymentsList paymentsData={paymentsData} isLoading={loading} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />
        {editMode && <ExpressPaymentForm {...paymentForm} contract={contract} setOpen={setPaymentForm} getPayments={getPaymentsList} />}
    </>);;
};

export default ExpressPayments;