import { Accordion, AccordionDetails, AccordionSummary,Divider,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FC } from 'react';
import { ExpandMore, Description } from '@mui/icons-material';
import LabelStatus, { ILabelStatus } from '@src/Components/LabelStatus';
import LabelTextBox from '@src/Components/LabelTextBox';
import { formatDate } from '@src/Utils';
import { DATE_FORMAT } from '@src/Constants';
import { IRecurring } from '../Payments/Recurring/Detail';

export interface IContract {
    id: number;
    start_date: string | number | Date;
    end_date: string | number | Date;
    due_date: IContractDueDate;
    active: boolean;
    is_overdue: boolean;
    payment_status: IContractPaymentStatus;
    recurring_payments?: IRecurring[];
}

export interface IContractDueDate {
    day: number;
    start: string | number | Date;
    end: string | number | Date;
}

export interface IContractPaymentStatus {
    status: ILabelStatus;
    monthly_amount: number;
    required_amount: number;
    total_amount: number;
    pending_amount: number;
    pending_months: number;
}

interface IContractDetailsPros {
    contract: IContract;
};

const ContractDetails: FC<IContractDetailsPros> = ({ contract }) => {
    const { id, start_date, end_date, due_date, payment_status } = contract;

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            id="contract"
        >
            <Description sx={{ marginRight: '.7rem '}} />
            <Typography variant="h6">Detalles Del Contrato</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={1}>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Inicio:" text={formatDate(start_date, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Finalización:" text={formatDate(end_date, DATE_FORMAT.DATE_LONG)} />
                </Grid>
            </Grid>
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            <Grid container spacing={1}>
                <Grid xs={12}>
                    <LabelTextBox title="Día de Corte:" text={due_date.day} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Próxima Fecha de corte:" text={formatDate(due_date.start, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Vencimiento:" text={formatDate(due_date.end, DATE_FORMAT.DATE_LONG)} />
                </Grid>
            </Grid>
            {payment_status && <LabelStatus {...payment_status.status} />}
        </AccordionDetails>
    </Accordion>);
}

export default ContractDetails;