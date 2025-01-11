import { FC, useEffect, useState } from "react";
import RecurringChargeForm, { IRecurringChargeForm } from "./Form";
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import useDataResponse from "@src/Hooks/useDataResponse";
import { isNotNil } from "ramda";
import { formatDate, formatToMoney, mapKey } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";
import { Edit } from "@mui/icons-material";
import { IContract } from "../../Details";
import { IRecurringCharge } from "./Detail";

interface IRecurringChargesProps {
    editMode: boolean;
    contract: IContract;
}

const RecurringCharges: FC<IRecurringChargesProps> = ({ editMode = false, contract }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [recurringChargeForm, setRecurringChargeForm] = useState<IRecurringChargeForm>({ open: false, recurringCharge: null });
    const [recurringChargeData, setRecurringChargeData] = useState<IRecurringCharge[]>([]);

    const loadRecurringCharges = () => {
        fetchData.get('/properties/contracts/charges/recurring/charges.php', { contract: contract.id }, (response: TCallBack) => {
            const recurringCharge = validateResult(response.result);
            if (isNotNil(recurringCharge)) {
                setRecurringChargeData(recurringCharge);
            }
        });
    }

    useEffect(() => {
        const { id, recurring_charges } = contract;
        if (id > 0) {
            if (isNotNil(recurring_charges)) {
                setRecurringChargeData(recurring_charges);
            } else {
                loadRecurringCharges();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract.id]);

    return (<>
        <Header title="CARGOS MENSUALES:" typographyProps={{ variant: "subtitle2"} }>
            <Button size='small' disabled={loading} onClick={() => setRecurringChargeForm({ open: true, recurringCharge: null })}>+ CARGO MENSUAL</Button>
        </Header>
        <Stack spacing={1} sx={{ marginBottom: '1rem', padding: '.5rem'}}>
            {recurringChargeData.map((rec: IRecurringCharge, ix: number) => {
                return (<Grid key={mapKey('rc', ix)} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} container>
                    <Grid size={{ xs: 6 }} sx={{display: "flex"}}>
                        {editMode && (<IconButton size="small" onClick={() => setRecurringChargeForm({ open: true, recurringCharge: rec })}>
                            <Edit fontSize="inherit" />
                        </IconButton>)}
                        <Box>
                            <Typography variant="subtitle2" color={(rec.expired || rec.canceled) ? "error" : "success"}>
                                {rec.label}
                            </Typography>
                            <Typography>{formatToMoney(rec.value, rec.currency)}</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="subtitle2">Inicia:</Typography>
                        <Typography>{formatDate(rec.start_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="subtitle2">
                            { rec.expired ? "Finalizado:" : "Finaliza:" }
                        </Typography>
                        <Typography color={rec.expired ? "error" : "success"}>{formatDate(rec.end_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                </Grid>)
            })}
        </Stack>
        {editMode && <RecurringChargeForm {...recurringChargeForm} contract={{ id: contract.id, startDate: new Date(contract.start_date || ""), endDate: new Date(contract.end_date || "") }} setRecurringChargeForm={setRecurringChargeForm} loadRecurringCharges={loadRecurringCharges} />}
    </>)
};

export default RecurringCharges;