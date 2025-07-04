import { CheckBox } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { IPayment } from "@src/Components/Properties/Contracts/Payments";
import { IPaymentsData } from "@src/Components/Properties/Contracts/Payments/List";
import { formatToMoney, mapKey } from "@src/Utils";
import { isNotNil } from "ramda";
import { FC } from "react";
import PaymentRow from "./Payment";

interface IChargePayments {
    paymentsData: IPaymentsData | undefined;
    currency: string;
    setEditPayment: (payment: IPayment) => void;
};

const ChargePayments: FC<IChargePayments> = ({ paymentsData, currency, setEditPayment }) => {

    if (isNotNil(paymentsData)) {
        const { payments, total_amount } = paymentsData;
        console.log(payments);

        if (total_amount > 0) {
            return (<>
                <Stack spacing={1} sx={{ }}>
                    {payments.map((payment: IPayment, ix: number) => {
                        return <PaymentRow  key={mapKey('pm', ix)} payment={payment} setEditPayment={setEditPayment} />;
                    })}
                </Stack>
                <Divider sx={{ margin: '.2rem 0' }} />
                <Typography variant="caption" color="#FFF"><b>Total:</b> {`${formatToMoney(total_amount, currency)}`}</Typography>
            </>);
        } else {
            return <Button variant="text" color="inherit" fullWidth>{formatToMoney(0, currency)}</Button>
        }
    };

    return null;
};

export default ChargePayments;