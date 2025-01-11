import { FC, useEffect, useState } from "react";
import { Header, TCallBack, useFetchData } from "@phoxer/react-components";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import useDataResponse from "@src/Hooks/useDataResponse";
import { isNotNil } from "ramda";
import { formatDate, formatToMoney, mapKey } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";
import { Edit } from "@mui/icons-material";
import { IContract } from "../../Details";
import ExpressChargeForm, { IExpressChargeForm } from "./Form";
import { IExpressCharge } from "./Details";

interface IExpressChargesProps {
    editMode: boolean;
    contract: IContract;
}

const ExpressCharges: FC<IExpressChargesProps> = ({ editMode = false, contract }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [expressChargeForm, setExpressChargeForm] = useState<IExpressChargeForm>({ open: false, expressCharge: null });
    const [expressChargesData, setExpressChargesData] = useState<IExpressCharge[]>([]);

    const loadExpressCharges = () => {
        fetchData.get('/properties/contracts/charges/express/charges.php', { contract: contract.id }, (response: TCallBack) => {
            const expressCharges = validateResult(response.result);
            if (isNotNil(expressCharges)) {
                setExpressChargesData(expressCharges);
            }
        });
    };

    useEffect(() => {
        const { id, express_charges } = contract;
        if (id > 0) {
            if (isNotNil(express_charges)) {
                setExpressChargesData(express_charges);
            } else {
                loadExpressCharges();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract.id]);

    return (<>
        <Header title="CARGOS:" typographyProps={{ variant: "subtitle2"} }>
            <Button size='small' disabled={loading} onClick={() => setExpressChargeForm({ open: true, expressCharge: null })}>+ CARGO</Button>
        </Header>
        <Stack spacing={1} sx={{ marginBottom: '1rem', padding: '.5rem'}}>
            {expressChargesData.map((exp: IExpressCharge, ix: number) => {
                return (<Grid key={mapKey('rc', ix)} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} container>
                    <Grid size={{ xs: 6 }} sx={{display: "flex"}}>
                        {editMode && (<IconButton size="small" onClick={() => setExpressChargeForm({ open: true, expressCharge: exp })}>
                            <Edit fontSize="inherit" />
                        </IconButton>)}
                        <Box>
                            <Typography variant="subtitle2" color={(exp.expired || exp.canceled) ? "error" : "success"}>
                                {exp.label}
                            </Typography>
                            <Typography>{formatToMoney(exp.value, exp.currency)}</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="subtitle2">Inicia:</Typography>
                        <Typography>{formatDate(exp.start_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="subtitle2">
                            { exp.expired ? "Finalizado:" : "Finaliza:" }
                        </Typography>
                        <Typography color={exp.expired ? "error" : "success"}>{formatDate(exp.end_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                </Grid>)
            })}
        </Stack>
        {editMode && <ExpressChargeForm {...expressChargeForm} contract={{ id: contract.id }} setExpressChargeForm={setExpressChargeForm} loadExpressCharges={loadExpressCharges} />}
    </>);

};

export default ExpressCharges;