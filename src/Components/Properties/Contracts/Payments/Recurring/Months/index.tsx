import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { ExpandMore, CheckCircle, Report } from '@mui/icons-material';
import { Dispatch, FC, SetStateAction, useMemo  } from 'react';
import { DATE_FORMAT } from '@src/Constants';
import { capitalize, formatDate, mapKey } from '@src/Utils';
//--------------> import QuickPayments from './QuickPayment';
import { IPaymentMonth } from '..';
import { IPayment } from '../..';
import PaymentsList from '../../List';
import { IRecurringCharge } from '../../../Charges/Recurring/Detail';
import QuickPayments from '@src/Components/QuickPayments';
import { IContract } from '../../../Details';
import ChargeButton from '@src/Components/QuickPayments/ChargeBox';

interface IPaymentMonthProps {
    contract: IContract;
    paymentData: IPaymentMonth;
    editMode?: boolean;
    setDeletePayment: (id: number) => void;
    confirmPayment: (id: number, confirmed: number) => void;
    setEditPayment: (payment: IPayment) => void;
    setQuickPayment: (payment: IPayment) => void;
}

const PaymentMonth: FC<IPaymentMonthProps> = ({ contract, paymentData, setQuickPayment, setDeletePayment, setEditPayment, confirmPayment }) => {
    const { due_date, status, is_current, payments, total_amount, recurring_charges, required_amount } = paymentData;
    const { year_month, year, month } = paymentData.date;
    
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
            <PaymentsList paymentsData={{ payments, total_amount, pending_amount: required_amount }} isLoading={false} setDeletePayment={setDeletePayment} setEditPayment={setEditPayment} confirmPayment={confirmPayment}  />
            <Stack spacing={1} direction="row">
            {recurring_charges.map((charge: IRecurringCharge, ix: number) => {
                return <ChargeButton key={mapKey('cb', ix)} contract={contract} charge={charge} selectedDate={new Date(due_date)} loading={false} setQuickPayment={setQuickPayment} setEditPayment={setEditPayment} />
            })}
            </Stack>
        </AccordionDetails>
    </Accordion>)
}

export default PaymentMonth;