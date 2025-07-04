import { FC, useState } from "react";
import { Alert, AlertColor, AlertPropsColorOverrides, TableCell, TableRow, Typography } from "@mui/material";
import { OverridableStringUnion } from '@mui/types';
import { IProperty } from "@src/Components/Properties/Details";
import { IContract } from "@src/Components/Properties/Contracts/Details";
import { formatDate } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";
import ExpirationDetails from "./Details";
import { differenceInCalendarDays, differenceInSeconds, intervalToDuration } from "date-fns";

export interface IExirationData {
    contract: IContract;
    property: IProperty;
}

interface IExpirationDataProps {
    expirationData: IExirationData;
};


const ExpirationItem: FC<IExpirationDataProps> = ({ expirationData }) => {
    const [showContractDetails, setShowContractDetails] = useState<boolean>(false);
    const { property, contract } = expirationData;
    const { title, group } = property;
    const { expired, end_date, type} = contract;

    const showGroup: boolean = (property.group.id > 1);
    let color: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>  = expired ? "error" : "success";

    if (!expired) {
        const difference = differenceInCalendarDays(
            new Date(end_date),
            new Date()
        );
        if (difference <= 15) {
            color = "warning";
        };
        if (difference > 15 && difference <= 45) {
            color = "attencion";
        };
        
    }

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                <Typography variant="subtitle2">{title}</Typography>
                {showGroup && <Typography variant="caption">{group.title}</Typography>}
            </TableCell>
            <TableCell>
                <Alert icon={false} variant="filled" color={color} sx={{ justifyContent: "center", textAlign: "center"}}>
                    <Typography color="inherit" variant="subtitle2">{formatDate(end_date, DATE_FORMAT.DATE_LONG)}</Typography>
                </Alert>
            </TableCell>
        </TableRow>
        <ExpirationDetails property={property} contract={contract} open={showContractDetails} setClose={setShowContractDetails} />
    </>);
};

export default ExpirationItem;