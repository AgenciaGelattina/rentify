import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { ExpandMore, CheckCircle, Report } from '@mui/icons-material';
import PaymentsTable from './PaymentsTable';
import { FC, useMemo  } from 'react';
import { DATE_FORMAT } from '@src/Constants';
import { capitalize, formatDate } from '@src/Utils';
import { IPayment, IPaymentMonth } from '..';

type TPaymentData = {
    paymentData: IPaymentMonth;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
}

const PaymentMonth: FC<TPaymentData> = ({ paymentData, removePayment, editPayment }) => {
    const { due_date, in_debt, is_current, total_amount } = paymentData;
    const { year, month, year_month } = paymentData.date;
    
    const monthDate: String = useMemo(() => {
        return capitalize(formatDate(due_date, DATE_FORMAT.MONTH_YEAR));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [due_date]);

    const dueDate: String = useMemo(() => {
        return capitalize(formatDate(due_date, DATE_FORMAT.DATE_LONG));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [due_date]);
       
    return (<Accordion defaultExpanded={is_current}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`${year_month}-content`}
          id={`${year_month}-header`}
        >
            <Box>
                <Stack spacing={1} direction="row" alignItems="center">
                    {in_debt ? <Report color='error' sx={{ width: 20, height: 20 }} /> : <CheckCircle color='success' sx={{ width: 20, height: 20 }} /> }
                    <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1 }}>{monthDate}</Typography>
                </Stack>
                <Typography color={in_debt ? "error" : "success"} variant="caption">{`Corte: ${dueDate}`}</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
           <PaymentsTable payments={paymentData.payments} total_amount={total_amount} removePayment={removePayment} editPayment={editPayment} />
        </AccordionDetails>
    </Accordion>)
}

export default PaymentMonth;