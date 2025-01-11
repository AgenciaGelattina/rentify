import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import { Edit, DeleteForever, Description } from '@mui/icons-material';
import { FC, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT, PAYMENT_TYPE } from '@src/Constants';
import ClarificationsModal,{ TClarificationsModal, descriptionModalDefault } from './Clarifications';
import { isEmpty, isNotNil } from 'ramda';
import { NumericFormat } from 'react-number-format';
import { ConditionalRender, TCallBack, useFetchData } from '@phoxer/react-components';
import { IPayment } from '..';

export interface IPaymentsData {
    payments: IPayment[];
    total_amount: number;
}

export const paymentDataDefault: IPaymentsData = { payments: [], total_amount: 0 };

interface IPaymentsListProps {
    paymentsData: IPaymentsData;
    isLoading: boolean;
    editMode?: boolean;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
}

const PaymentsList: FC<IPaymentsListProps> = ({ paymentsData = paymentDataDefault, isLoading, editPayment, removePayment, editMode = false }) => {
    const [clarification, setClarification] = useState<TClarificationsModal>(descriptionModalDefault);

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
                    const { type, recurring, express } = payment;
                    let label = "";
                    if (isNotNil(recurring)) {
                        label = `: ${recurring.label}`;
                    } else if (isNotNil(express)) {
                        label = `: ${express.label}`;
                    }
                    return <Typography variant="body2">{`${PAYMENT_TYPE[type]}${label}`}</Typography>;
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
        <DataTable columns={buildDataContent()} data={paymentsData.payments} loading={isLoading} />
        <ClarificationsModal {...clarification} onClose={setClarification} />
        <Divider />
        <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>{`Total: $${paymentsData.total_amount}`}</Typography>
    </Box>)
}

export default PaymentsList;