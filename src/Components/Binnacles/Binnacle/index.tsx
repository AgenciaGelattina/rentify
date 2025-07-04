import { Paper, Typography } from "@mui/material";
import { FC } from "react";

export interface IBinnacle {
    id: number;
    account: number
    property: number;
    contract?: number;
    text: string;
    created: Date | string;
}

interface IBinnacleProps {
    binnacle: IBinnacle;
}

const Binnacle: FC<IBinnacleProps> = ({ binnacle }) => {
    const { id, account, property, text } = binnacle;

    return (<Paper>
        <Typography variant="body2" gutterBottom>
            {text}
        </Typography>
    </Paper>);
};

export default Binnacle;