import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, IconButton, Paper, Stack, Table, TableCell, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import LabelStatus, { ILabelStatus } from "@src/Components/LabelStatus";
import { IContract } from "@src/Components/Properties/Contracts/Details";
import { IRecurring, IRecurringPaymentStatus } from "@src/Components/Properties/Contracts/Payments/Recurring/Detail";
import { IProperty } from "@src/Components/Properties/Details";
import { CSSProperties, FC, useState } from "react";
import { Description, ExpandMore, ExpandLess } from "@mui/icons-material";
import DataTable, { IDataTableColumn } from "@src/Components/DataTable";
import { formatDate, formatToMoney } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";

export interface IResumeData {
    contract: IContract;
    property: IProperty;
}

interface IResumeRowProps extends IResumeData {
    openContractGeneralView: (property: IProperty, contract: IContract) => void;
}

const ResumeRow: FC<IResumeRowProps> = ({ property, contract, openContractGeneralView }) => {
    const [showRecurringData, setShowRecurringData] = useState<boolean>(false);

    const togleRecurringDataView = () => {
        setShowRecurringData((srd: boolean) => !srd);
    }

    const buildDataContent = (): IDataTableColumn[] => {
        return [
            {
                dataKey: "label",
                head: {
                    label: "Pago Recurrente"
                },
                component: (label: string) => {
                    return <Typography variant="body2">{label}</Typography>;
                }
            },
            {
                head: {
                    label: "Estado"
                },
                component: (rec: IRecurring) => {
                    return <LabelStatus {...rec.payment_status.status} />;
                }
            },
            {
                dataKey: "value",
                head: {
                    label: "Cobro Mensual"
                },
                component: (value: number, rec: IRecurring) => {
                    return <Typography variant="body2">{formatToMoney(value, rec.currency)}</Typography>;
                }
            },
            {
                head: {
                    label: "Deuda:"
                },
                component: (rec: IRecurring) => {
                    return <Typography variant="body2">{formatToMoney(rec.payment_status.pending_amount, rec.currency)}</Typography>;
                }
            },
            {
                head: {
                    label: "Meses de Deuda:"
                },
                component: (rec: IRecurring) => {
                    return <Typography variant="body2">{rec.payment_status.pending_months}</Typography>;
                }
            }
        ];
    }

    const pd: CSSProperties = showRecurringData? { paddingBottom: 30, paddingTop: 10, borderBottom: 'solid .2rem rgb(224 224 224)' } : { paddingBottom: 0, paddingTop: 0 };
    return (<>
        <TableRow>
            <TableCell>
                <Stack direction="row" alignItems="center" sx={{ justifyContent: 'end' }} spacing={1}>
                    <IconButton color='success' onClick={() => openContractGeneralView(property, contract)}>
                        <Description fontSize="inherit" />
                    </IconButton>
                </Stack>
            </TableCell>
            <TableCell onClick={togleRecurringDataView}>
                {contract?.payment_status?.status && <LabelStatus {...contract.payment_status.status} action={showRecurringData ? <ExpandLess /> : <ExpandMore />} />}
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{property.title}</Typography>
                <Typography variant="caption">{property.group.title}</Typography>
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="body2">{formatToMoney(contract.payment_status.monthly_amount, contract.currency)}</Typography>
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="body2" color={contract.payment_status.status.severity}>{formatToMoney(contract.payment_status.pending_amount, contract.currency)}</Typography>
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="body2" color={contract.payment_status.status.severity}>{contract.payment_status.pending_months}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{formatDate(contract.due_date.start, DATE_FORMAT.DATE_LONG)}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" color={contract.expired ? 'error' : contract.payment_status.status.severity}>{formatDate(contract.due_date.end, DATE_FORMAT.DATE_LONG)}</Typography>
            </TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell style={pd} colSpan={8}>
                <Collapse in={showRecurringData}>
                    <DataTable columns={buildDataContent()} data={contract.recurring_payments || []} loading={false} />
                </Collapse>
            </TableCell>
        </TableRow>
    </>);
};

export default ResumeRow;