import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { ExpandMore, CheckCircle, Report } from '@mui/icons-material';
import PaymentsTable from './PaymentsTable';
import { Dispatch, FC, SetStateAction, useMemo  } from 'react';
import { DATE_FORMAT } from '@src/Constants';
import { capitalize, formatDate } from '@src/Utils';
import { IPayment, IPaymentMonth } from '..';

interface IPaymentDataProps {
    contract: { id: number };
    paymentData: IPaymentMonth;
    editMode?: boolean;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
}

const PaymentMonth: FC<IPaymentDataProps> = ({ contract, paymentData, removePayment, editPayment, editMode = false }) => {
    const { due_date, status, is_current, payments, total_amount } = paymentData;
    const { year_month } = paymentData.date;
    
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
                    <CheckCircle color={status.severity} sx={{ width: 20, height: 20 }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1 }}>{monthDate}</Typography>
                </Stack>
                <Typography color={status.severity} variant="caption">{`Corte: ${dueDate}`}</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
           <PaymentsTable contract={contract} paymentsDataDefault={{ payments, total_amount }} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />
        </AccordionDetails>
    </Accordion>)
}

export default PaymentMonth;