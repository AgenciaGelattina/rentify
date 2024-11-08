import { Box, Card, CardContent, Checkbox, Stack, Typography } from "@mui/material";
import { mapKey } from "@src/Utils";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

export interface IContractor {
    names: string;
    surnames: string;
    email: string;
    phone: string;
    selected: boolean;
}

interface IContractorsProps {
    contractors: IContractor[];
    setContractors: Dispatch<SetStateAction<IContractor[]>>;
}

const Contractors: FC<IContractorsProps> = ({ contractors, setContractors }) => {

    const onCheckBoxChange = (contractor: IContractor, checked: boolean) => {
        setContractors((contractors: IContractor[]) => {
            return contractors.map((cntr: IContractor) => {
                if (contractor === cntr) {
                    return {...cntr, selected: checked }
                }
                return cntr;
            });
        });
    }

    return (<Card sx={{ marginTop: ".5rem" }}>
         <CardContent>
            <Typography variant="subtitle2">Contactos:</Typography>
            <Stack spacing={1}>
                {contractors.map((contractor: IContractor, ix: number) => {
                    return (<Box key={mapKey("cnts",ix)} sx={{ display: "flex" }}>
                        <Checkbox checked={contractor.selected} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            onCheckBoxChange(contractor, e.currentTarget.checked);
                        }} />
                        <Box>
                            <Typography variant="body2">{`${contractor.names} ${contractor.surnames}`}</Typography>
                            <Typography variant="caption">{`Email: ${contractor.email} | Teléfono: ${contractor.phone}`}</Typography>
                        </Box>
                    </Box>)
                })}
            </Stack>
        </CardContent>
    </Card>)
};

export default Contractors;