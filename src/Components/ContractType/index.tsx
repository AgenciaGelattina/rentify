import { FC, MouseEventHandler } from "react";
import { CalendarMonth, AccessAlarm } from '@mui/icons-material';
import { TContractType } from "../Properties/Contracts/Details";
import { Chip } from "@mui/material";
import { CONTRACT_TYPE } from "@src/Constants";

interface IContractType {
    type: TContractType;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const ContractType: FC<IContractType> = ({ type, onClick }) => {
    return <Chip
        label={CONTRACT_TYPE[type]}
        onClick={onClick}
        icon={type === 'recurring' ? <CalendarMonth /> : <AccessAlarm />}
    />;
};

export default ContractType;