import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from '@mui/material';
import { ConditionalRender } from '@phoxer/react-components';
import Grid from '@mui/material/Unstable_Grid2';
import TabsContent from '@src/Components/TabsContent';
import Payments from '../Payments';
import Contractors from '../Contractors';
import FileFolders from '../FileFolders';
import LabelTextBox from '@src/Components/LabelTextBox';
import { FC } from 'react';
import { formatDate, diffDates, strToDate, formatToMoney } from '@src/Utils';
import { ExpandMore, Description } from '@mui/icons-material';
import { DATE_FORMAT } from "@src/Constants";

export type TContractDetails = {
    id: number;
    value: number;
    start_date: string;
    end_date: string;
    due_date: string;
    current_months: number;
    total_months: number;
    pending_months: number;
    in_debt: boolean;
    rent_is_due: boolean;
    debt: number;
}

const ContractDetails: FC<TContractDetails> = (contract) => {
    const { id, start_date, end_date, due_date, rent_is_due, value, in_debt, debt } = contract;
    return (<Box>
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            id="contract"
            >
                <Description sx={{ marginRight: '.7rem '}} />
                <Typography variant="h6">Detalles Del Contrato</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <LabelTextBox title="Fecha de corte:" text={formatDate(due_date, DATE_FORMAT.DATE_LONG)} />
                <ConditionalRender condition={!rent_is_due}>
                    <LabelTextBox title="Dias restantes:" text={diffDates(new Date(), due_date).days} />
                </ConditionalRender>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6}>
                        <LabelTextBox title="Fecha de inicio:" text={formatDate(start_date, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <LabelTextBox title="Fecha de Vencimiento:" text={formatDate(end_date, DATE_FORMAT.DATE_LONG)} />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6}>
                        <LabelTextBox title="Valor de Renta:" text={formatToMoney(value)} />
                    </Grid>
                    <ConditionalRender condition={in_debt}>
                        <Grid xs={12} sm={6}>
                            <LabelTextBox title="Total a Cobrar:" text={formatToMoney(debt)} />
                        </Grid>
                    </ConditionalRender>
                </Grid>
            </AccordionDetails>
        </Accordion>
        <Divider />
        <TabsContent tabs={[
            { 
                tab: { label: "PAGOS" },
                component: () => {
                    return <Payments contract={{ id }} editMode={false} />;
                }
            },
            { 
                tab: { label: "INQUILINOS" },
                component: () => {
                    return <Contractors contract={{ id }} editMode={false} />;
                }
            },
            { 
                tab: { label: "ARCHIVOS" },
                component: () => {
                    return <FileFolders contract={{ id }} editMode={false} />
                }
            }
        ]} />
    </Box>)
}

export default ContractDetails;