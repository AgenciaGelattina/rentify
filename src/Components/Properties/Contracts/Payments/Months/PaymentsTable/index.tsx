import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import { Edit, DeleteForever, Description } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT } from '@src/Constants';
import ClarificationsModal,{ TClarificationsModal, descriptionModalDefault } from './Clarifications';
import { isEmpty, isNotNil } from 'ramda';
import { NumericFormat } from 'react-number-format';
import { IPayment, IRecurringPayment } from '../..';
import { ConditionalRender, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import QuickPayments from '../QuickPayment';

interface IPaymentsData {
    payments: IPayment[];
    total_amount: number;
}

interface IPaymentsTableProps {
    contract: { id: number };
    paymentsDataDefault?: IPaymentsData;
    editMode?: boolean;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
}


const PaymentsTable: FC<IPaymentsTableProps> = ({ contract, paymentsDataDefault, editPayment, removePayment, editMode = false }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [paymentsData, setPaymentsData] = useState<IPaymentsData>({ payments: [], total_amount: 0 });
    const [clarification, setClarification] = useState<TClarificationsModal>(descriptionModalDefault);

    const getPayments = () => {
        fetchData.get('/properties/contracts/payments/payments_list.php', { contract_id: contract.id }, (response: TCallBack) => {
            const paymentsDataValidation = validateResult(response.result);
            if (paymentsDataValidation) {
                setPaymentsData(paymentsDataValidation);
            }
        });
    }

    useEffect(() => {
        if (isNotNil(paymentsDataDefault)) {
            setPaymentsData(paymentsDataDefault);
        } else {
            getPayments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentsDataDefault?.payments]);

    const buildDataContent = (): IDataTableColumn[] => {
        return [
            {
                head: {
                    label: "",
                },
                component: (payment: IPayment) => {
                    return (<Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                        <ConditionalRender condition={editMode}>
                            <IconButton onClick={() => editPayment(payment)}>
                                <Edit fontSize="inherit" />
                            </IconButton>
                        </ConditionalRender>
                        <ConditionalRender condition={!isEmpty(payment.clarifications)}>
                            <IconButton onClick={() => setClarification({ open: true, clarification: payment.clarifications })}>
                                <Description fontSize="inherit" />
                            </IconButton>
                        </ConditionalRender>
                    </Stack>);
                }
            },
            {
                dataKey: "date",
                head: {
                    label: "Fecha de Pago",
                },
                component: (date: string) => {
                    return <Typography variant="body2">{`${format(new Date(date), DATE_FORMAT.DATE_LONG, { locale: es })}`}</Typography>;
                }
            },
            {
                head: {
                    label: "Tipo",
                },
                component: (payment: IPayment) => {
                    const { type, recurring } = payment;
                    const recurringLabel = (recurring.id === 0) ? "Renta" : recurring.label;
                    const label = (type.id === 1) ? `${type.label}: ${recurringLabel}` : type.label;
                    return <Typography variant="body2">{label}</Typography>;
                }
            },
            {
                dataKey: "amount",
                head: {
                    label: "Pago"
                },
                component: (amount: number, data: IPayment) => {
                    return (<Typography variant="body2">
                        <NumericFormat displayType="text" value={amount} thousandSeparator valueIsNumericString prefix="$" />
                    </Typography>);
                }
            },
            {
                head: {
                    label: "",
                },
                component: (payment: IPayment) => {
                    return (<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        <ConditionalRender condition={editMode}>
                            <IconButton onClick={() => removePayment(payment.id)}>
                                <DeleteForever fontSize="inherit" color="error" />
                            </IconButton>
                        </ConditionalRender>
                    </Stack>);
                }
            },
        ];
    }

    return (<Box>
        <DataTable columns={buildDataContent()} data={paymentsData.payments} loading={loading} />
        <ClarificationsModal {...clarification} onClose={setClarification} />
        <Divider />
        <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>{`Total: $${paymentsData.total_amount}`}</Typography>
    </Box>)
}

export default PaymentsTable;