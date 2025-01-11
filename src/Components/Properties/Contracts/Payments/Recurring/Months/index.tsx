import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { ExpandMore, CheckCircle, Report } from '@mui/icons-material';
import { Dispatch, FC, SetStateAction, useMemo  } from 'react';
import { DATE_FORMAT } from '@src/Constants';
import { capitalize, formatDate } from '@src/Utils';
import { ConditionalRender } from '@phoxer/react-components';
import QuickPayments from './QuickPayment';
import { IPaymentMonth, IRecurringCharge } from '..';
import { IPayment } from '../..';
import PaymentsList from '../../List';
import { IContract } from '../../../Details';

interface IPaymentMonthProps {
    paymentData: IPaymentMonth;
    editMode?: boolean;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
    setQuickPayment: (recurring_charge: IRecurringCharge, due_date: Date) => void;
}

const PaymentMonth: FC<IPaymentMonthProps> = ({ paymentData, setQuickPayment, removePayment, editPayment, editMode = false }) => {
    const { due_date, status, is_current, payments, total_amount, recurring_charges } = paymentData;
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
            <PaymentsList paymentsData={{ payments, total_amount }} isLoading={false} removePayment={removePayment} editPayment={editPayment} editMode={editMode} />
            <ConditionalRender condition={editMode}>
                <QuickPayments recurring_charges={recurring_charges} setQuickPayment={setQuickPayment} due_date={due_date} />
            </ConditionalRender>
        </AccordionDetails>
    </Accordion>)
}

export default PaymentMonth;