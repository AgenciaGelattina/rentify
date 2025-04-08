import { FC, useState } from "react";
import { CircularProgress, Stack, TableCell, TableRow, Typography } from "@mui/material";
import LabelStatus from "@src/Components/LabelStatus";
import { IContract, TContractCharge, TContractType } from "@src/Components/Properties/Contracts/Details";
import { IProperty } from "@src/Components/Properties/Details";
import { dateIsExpired, formatDate, formatToMoney } from "@src/Utils";
import { DATE_FORMAT, STATE_ACTIONS } from "@src/Constants";
import ContractType from "@src/Components/ContractType";
import PaymentCollectionDetails from "./Details";

interface IPaymentCollectionRowProps {
    contract: IContract;
    property: IProperty;
    loading: boolean;
}

const PaymentCollectionRow: FC<IPaymentCollectionRowProps> = ({ property, contract, loading }) => {
    const [showContractDetails, setShowContractDetails] = useState<boolean>(false);
    
    return (<>
        <TableRow>
            <TableCell>
                {loading && <CircularProgress size="small" />}
                {!loading && <Stack direction="row" alignItems="center" sx={{ justifyContent: 'center' }} spacing={1}>
                    <ContractType type={contract.type} onClick={() => setShowContractDetails(true)} />
                </Stack>}
            </TableCell>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{property.title}</Typography>
                {property.group.id > 1 && <Typography variant="caption">{property.group.title}</Typography>}
            </TableCell>
            <TableCell sx={{ cursor: "pointer" }} onClick={() => setShowContractDetails(true)}>
                {contract.status && <LabelStatus {...contract.status} />}
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
        <PaymentCollectionDetails property={property} contract={contract} open={showContractDetails} setClose={setShowContractDetails} />
    </>);
};

export default PaymentCollectionRow;