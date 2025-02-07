import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, IconButton, Paper, Stack, Table, TableCell, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2/Grid2";
import LabelStatus, { ILabelStatus } from "@src/Components/LabelStatus";
import { IContract, TContractCharge, TContractType } from "@src/Components/Properties/Contracts/Details";
import { IProperty } from "@src/Components/Properties/Details";
import { CSSProperties, FC, useMemo, useState } from "react";
import { Description, ExpandMore, ExpandLess } from "@mui/icons-material";
import DataTable, { IDataTableColumn } from "@src/Components/DataTable";
import { dateIsExpired, formatDate, formatToMoney } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";
import { isNotNil } from "ramda";
import ContractType from "@src/Components/ContractType";

export interface IResumeData {
    contract: IContract;
    property: IProperty;
};

interface IResumeRowProps extends IResumeData {
    openContractGeneralView: (property: IProperty, contract: IContract) => void;
}

const ResumeRow: FC<IResumeRowProps> = ({ property, contract, openContractGeneralView }) => {
    const [showChargesData, setChargesData] = useState<boolean>(false);

    const chargesData: TContractCharge[] = useMemo(() => {
        return isNotNil(contract.recurring_charges) ? contract.recurring_charges : isNotNil(contract.express_charges) ? contract.express_charges : [];
    }, [contract.express_charges, contract.recurring_charges]);

    const buildDataContent = (type: TContractType): IDataTableColumn[] => {
        return [
            {
                dataKey: "label",
                head: {
                    label: "Cargos"
                },
                component: (label: string) => {
                    return <Typography variant="body2">{label}</Typography>;
                }
            },
            {
                head: {
                    label: "Estado"
                },
                component: (charge: TContractCharge) => {
                    return <LabelStatus {...charge.status} />;
                }
            },
            {
                dataKey: "value",
                head: {
                    label: "Monto a cobrar:"
                },
                component: (value: number, charge: TContractCharge) => {
                    return <Typography variant="body2">{formatToMoney(value, charge.currency)}</Typography>;
                }
            },
            {
                head: {
                    label: "Deuda:"
                },
                component: (charge: TContractCharge) => {
                    return <Typography variant="body2">{formatToMoney(charge.statements.pending_amount, charge.currency)}</Typography>;
                }
            }
        ];
    };

    const pd: CSSProperties = showChargesData ? { paddingBottom: 30, paddingTop: 10, borderBottom: 'solid .2rem rgb(224 224 224)' } : { paddingBottom: 0, paddingTop: 0 };
    return (<>
        <TableRow>
            <TableCell>
                <Stack direction="row" alignItems="center" sx={{ justifyContent: 'center' }} spacing={1}>
                    <ContractType type={contract.type} onClick={() => openContractGeneralView(property, contract)} />
                </Stack>
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{property.title}</Typography>
                {property.group.id > 1 && <Typography variant="caption">{property.group.title}</Typography>}
            </TableCell>
            <TableCell sx={{ cursor: "pointer" }} onClick={() => setChargesData((bl) => !bl)}>
                {contract.status && <LabelStatus {...contract.status} action={showChargesData ? <ExpandLess /> : <ExpandMore />} />}
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="body2">{formatToMoney(contract.statements.pending_amount, contract.currency)}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" color={dateIsExpired(contract.due_date.start) ? 'error' : 'success'}>{formatDate(contract.due_date.start, DATE_FORMAT.DATE_LONG)}</Typography>
                <Typography variant="caption" color={dateIsExpired(contract.due_date.end) ? 'error' : 'success'}>{formatDate(contract.due_date.end, DATE_FORMAT.DATE_LONG)}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" color={contract.expired ? 'error' : 'success'}>{formatDate(contract.end_date, DATE_FORMAT.DATE_LONG)}</Typography>
            </TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell style={pd} colSpan={8}>
                <Collapse in={showChargesData}>
                    <DataTable columns={buildDataContent(contract.type)} data={chargesData || []} loading={false} />
                </Collapse>
            </TableCell>
        </TableRow>
    </>);

   return null;
};

export default ResumeRow;