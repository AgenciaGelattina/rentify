import { FC, useMemo } from "react";
import { Button, Stack } from "@mui/material";
import { TCharge } from "../Properties/Contracts/Charges";
import ChargeBox from "./ChargeBox";
import { mapKey } from "@src/Utils";
import { IPayment } from "../Properties/Contracts/Payments";
import { IContract } from "../Properties/Contracts/Details";
import { isNotNil } from "ramda";

interface IQuickPaymentsProps {
    contract: IContract;
    selectedDate: Date;
    setQuickPayment: (payment: IPayment) => void;
    setEditPayment: (payment: IPayment) => void;
}

const QuickPayments: FC<IQuickPaymentsProps> = ({ contract, selectedDate, setQuickPayment, setEditPayment }) => {
    const { recurring_charges, express_charges } = contract;

    const charges: TCharge[] | undefined = useMemo(() => {
        return recurring_charges || express_charges;
    }, [recurring_charges, express_charges]);

    if (isNotNil(charges)) {
        return (<Stack spacing={1} direction="row">
            {charges.map((charge: TCharge, ix: number) => {
                return <ChargeBox key={mapKey('cb', ix)} contract={contract} charge={charge} selectedDate={selectedDate} loading={false} setQuickPayment={setQuickPayment} setEditPayment={setEditPayment} />
            })}
        </Stack>);
    };

    return null;
};

export default QuickPayments;