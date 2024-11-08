import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import RecurringPaymentForm, { IRecurringPayment, IRecurringPaymentForm } from "./Form";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { isNotNil } from "ramda";
import { formatDate, formatToMoney, mapKey } from "@src/Utils";
import { DATE_FORMAT } from "@src/Constants";
import { Edit } from "@mui/icons-material";
import { IContract } from "../../Details";
import { IRecurring } from "./Detail";

interface IRecurringListProps {
    editMode: boolean;
    contract: IContract;
    recurringPaymentForm?: IRecurringPaymentForm;
    setRecurringPaymentForm?: Dispatch<SetStateAction<IRecurringPaymentForm>>;
}

const RecurringList: FC<IRecurringListProps> = ({ editMode = false, contract, recurringPaymentForm, setRecurringPaymentForm }) => {
    const [recurringData, setRecurringData] = useState<IRecurring[]>([]);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    
    const loadRecurringPayments = () => {
        fetchData.get('/properties/contracts/payments/recurring/recurring.php', { contract: contract.id }, (response: TCallBack) => {
            const recurring = validateResult(response.result);
            if (recurring) {
                setRecurringData(recurring);
            }
        });
    }

    useEffect(() => {
        const { id, recurring_payments } = contract;
        if (id > 0) {
            if (recurring_payments) {
                setRecurringData(recurring_payments);
            } else {
                loadRecurringPayments();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract.id]);

    const editRecurringPayment = (recurringPayment: IRecurring) => {
        if (editMode && setRecurringPaymentForm) {
            setRecurringPaymentForm({ open: true, recurringPayment });
        }
    }

    return (<>
        <Stack spacing={1} sx={{ marginBottom: '1rem', padding: '.5rem'}}>
            {recurringData.map((rec: IRecurring, ix: number) => {

                return (<Grid key={mapKey('rc', ix)} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} container>
                    <Grid item xs={6} sx={{display: "flex"}}>
                        <IconButton size="small" onClick={() => editRecurringPayment(rec)}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <Box>
                            <Typography variant="subtitle2" color={(rec.expired || rec.canceled) ? "error" : "success"}>
                                {rec.label}
                            </Typography>
                            <Typography>{formatToMoney(rec.value, rec.currency)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle2">Inicia:</Typography>
                        <Typography>{formatDate(rec.start_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle2">
                            { rec.expired ? "Finalizado:" : "Finaliza:" }
                        </Typography>
                        <Typography color={rec.expired ? "error" : "success"}>{formatDate(rec.end_date || "", DATE_FORMAT.DATE_LONG)}</Typography>
                    </Grid>
                </Grid>)
            })}
        </Stack>
        {editMode && isNotNil(recurringPaymentForm) && isNotNil(setRecurringPaymentForm) &&
            <RecurringPaymentForm {...recurringPaymentForm} contract={{ id: contract.id, startDate: new Date(contract.start_date || ""), endDate: new Date(contract.end_date || "") }} setRecurringPaymentForm={setRecurringPaymentForm} loadRecurringPayments={loadRecurringPayments} />
        }
    </>)
};

export default RecurringList;