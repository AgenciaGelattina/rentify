import { Accordion, AccordionDetails, AccordionSummary,Divider,Typography } from '@mui/material';
import { FC, SyntheticEvent } from 'react';
import Grid from '@mui/material/Grid2';
import { ExpandMore, Description } from '@mui/icons-material';
import LabelStatus, { ILabelStatus } from '@src/Components/LabelStatus';
import LabelTextBox from '@src/Components/LabelTextBox';
import { CONTRACT_TYPE, CURRENCY, DATE_FORMAT } from '@src/Constants';
import { IRecurringCharge } from '../Charges/Recurring/Detail';
import { IExpressCharge } from '../Charges/Express/Details';
import { isNotNil } from 'ramda';
import { ConditionalRender } from '@phoxer/react-components';
import { ICurrency } from '@src/Components/Forms/CurrencySelector';
import { formatDate } from '@src/Utils';

export interface IContract {
    id: number;
    type: TContractType;
    start_date: string | number | Date;
    end_date: string | number | Date;
    in_date: string | number | Date;
    out_date: string | number | Date;
    currency: ICurrency;
    due_date: IContractDueDate;
    status: ILabelStatus;
    recurring_charges?: IRecurringCharge[];
    express_charges?: IExpressCharge[];
    payments_status: RecurringPaymentsStatus | ExpressPaymentsStatus;
    expired: boolean;
    canceled: boolean;
    finalized: boolean;
}

export type TContractType = "recurring" | "express";

export interface IContractDueDate {
    day: number;
    start: string | number | Date;
    end: string | number | Date;
}

interface IContractDetailsPros {
    contract: IContract;
    actions?: React.ReactNode;
};

interface RecurringPaymentsStatus {
    monthly_amount: number;
    pending_months: number;
    required_amount: number;
    total_amount: number;
    pending_amount: number;
}

interface ExpressPaymentsStatus {
    required_amount: number;
    total_amount: number;
    pending_amount: number;
}

const ContractDetails: FC<IContractDetailsPros> = ({ contract, actions }) => {
    const { id, type, start_date, end_date, due_date, in_date, out_date, currency, status, expired, canceled, finalized } = contract;

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
                <Grid size={{ xs: 12, sm: 4 }}>
                    <LabelTextBox title="ID:" text={`#${id}`} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <LabelTextBox title="Tipo de Contrato:" text={CONTRACT_TYPE[type]} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <LabelTextBox title="Moneda:" text={CURRENCY[currency].text} />
                </Grid>
            </Grid>
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LabelTextBox title="Fecha de Inicio:" text={formatDate(start_date, DATE_FORMAT.DATE_LONG)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LabelTextBox title="Fecha de Finalización:" text={formatDate(end_date, DATE_FORMAT.DATE_LONG)} titleTypographyProps={{ color: expired ? "error" : "success" }} />
                </Grid>
            </Grid>
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            {type === "recurring" && (<>
                <Typography variant='subtitle2'>Ingreso a la propiedad:</Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabelTextBox title="Fecha de Ingreso:" text={formatDate(in_date, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabelTextBox title="Fecha de Salida:" text={formatDate(out_date, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                </Grid>
                <Divider sx={{ margin: '1rem 0 1rem 0' }} />
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <LabelTextBox title="Día de Corte:" text={due_date.day} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabelTextBox title="Próxima Fecha de corte:" text={formatDate(due_date.start, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <LabelTextBox title="Vencimiento de Corte:" text={formatDate(due_date.end, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                </Grid>
                <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            </>)}

            {status && <LabelStatus {...status} />}
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