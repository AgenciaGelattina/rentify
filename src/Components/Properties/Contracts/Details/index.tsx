import { Accordion, AccordionDetails, AccordionSummary,Divider,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FC, SyntheticEvent } from 'react';
import { ExpandMore, Description } from '@mui/icons-material';
import LabelStatus, { ILabelStatus } from '@src/Components/LabelStatus';
import LabelTextBox from '@src/Components/LabelTextBox';
import { formatDate } from '@src/Utils';
import { CURRENCY, DATE_FORMAT } from '@src/Constants';
import { IRecurring } from '../Payments/Recurring/Detail';
import { isNotNil } from 'ramda';
import { ConditionalRender } from '@phoxer/react-components';
import { ICurrency } from '@src/Components/Forms/CurrencySelector';

export interface IContract {
    id: number;
    start_date: string | number | Date;
    end_date: string | number | Date;
    in_date: string | number | Date;
    out_date: string | number | Date;
    currency: ICurrency;
    due_date: IContractDueDate;
    payment_status: IContractPaymentStatus;
    recurring_payments?: IRecurring[];
    expired: boolean;
    canceled: boolean;
    finalized: boolean;
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
    actions?: React.ReactNode;
};

const ContractDetails: FC<IContractDetailsPros> = ({ contract, actions }) => {
    const { id, start_date, end_date, due_date, in_date, out_date, currency, payment_status, expired, canceled, finalized } = contract;

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            id="contract"
        >
            <Description sx={{ marginRight: '.7rem '}} />
            <Typography variant="h6">Detalles Del Contrato</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <LabelTextBox title="ID" text={`#${id}`} />
            <Grid container spacing={1}>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Inicio:" text={formatDate(start_date, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Finalización:" text={formatDate(end_date, DATE_FORMAT.DATE_LONG)} titleTypographyProps={{ color: expired ? "error" : "success" }} />
                </Grid>
            </Grid>
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            <Typography variant='subtitle2'>Ingreso a la propiedad:</Typography>
            <Grid container spacing={1}>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Ingreso:" text={formatDate(in_date, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid xs={12} sm={6}>
                    <LabelTextBox title="Fecha de Salida:" text={formatDate(out_date, DATE_FORMAT.DATE_LONG)} />
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
                    <LabelTextBox title="Vencimiento de Corte:" text={formatDate(due_date.end, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid xs={12}>
                    <LabelTextBox title="Tipo de Moneda:" text={CURRENCY[currency].text} />
                </Grid>
            </Grid>
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            {payment_status && <LabelStatus {...payment_status.status} />}
            {expired && <LabelStatus severity='warning' label="EXPIRADO" />}
            {canceled && <LabelStatus severity='warning' label="CANCELADO" />}
            {finalized && <LabelStatus severity='error' label="FINALIZADO" />}
            <ConditionalRender condition={isNotNil(actions)}>
                <Divider sx={{ margin: '1rem 0 1rem 0' }} />
                {actions}
            </ConditionalRender>
        </AccordionDetails>
    </Accordion>);
}

export default ContractDetails;