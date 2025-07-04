import { CheckBox, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { IPayment } from "@src/Components/Properties/Contracts/Payments";
import { formatToMoney } from "@src/Utils";
import { FC } from "react";

interface IPaymentRowProps {
    payment: IPayment;
    setEditPayment: (payment: IPayment) => void;
}

const PaymentRow: FC<IPaymentRowProps> = ({ payment, setEditPayment }) => {
    const { amount, currency } = payment;

    return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button variant="text" color="inherit" startIcon={<CheckBox color={payment.confirmed ? "success" : "warning"} sx={{backgroundColor: '#FFF'}} />} onClick={() => setEditPayment(payment)}>
            {`${formatToMoney(amount, currency)}`}
        </Button>
    </Box>);
};

export default PaymentRow;