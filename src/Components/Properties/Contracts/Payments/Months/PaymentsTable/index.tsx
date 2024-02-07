import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import { Edit, DeleteForever, Description } from '@mui/icons-material';
import { FC, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT } from '@src/Constants';
import ClarificationsModal,{ TClarificationsModal, descriptionModalDefault } from './Clarifications';
import { isEmpty } from 'ramda';
import { NumericFormat } from 'react-number-format';
import { IPayment } from '../..';

type TPaymentsTable = {
    payments: IPayment[];
    total_amount: number;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
}

const PaymentsTable: FC<TPaymentsTable> = ({ payments, total_amount, editPayment, removePayment }) => {
    const [clarification, setClarification] = useState<TClarificationsModal>(descriptionModalDefault);

    const buildDataContent = (): TDataTableColumn[] => {
        return [
            {
                dataKey: "amount",
                head: {
                    label: "Pago",
                },
                component: (amount: number) => {
                    return (<Typography variant="body2">
                        <NumericFormat displayType="text" value={amount} thousandSeparator valueIsNumericString prefix="$" />
                    </Typography>);
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
                dataKey: "type",
                head: {
                    label: "Tipo",
                },
                component: (type: { id: number, label: string }) => {
                    return <Typography variant="body2">{type.label}</Typography>;
                }
            },
            {
                head: {
                    label: "",
                },
                component: (payment: IPayment) => {
                    return (<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        {!isEmpty(payment.clarifications) && <IconButton onClick={() => setClarification({ open: true, clarification: payment.clarifications })}>
                            <Description fontSize="inherit" />
                        </IconButton>}
                        <IconButton onClick={() => editPayment(payment)}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => removePayment(payment.id)}>
                            <DeleteForever fontSize="inherit" color="error" />
                        </IconButton>
                    </Stack>);
                }
            }
        ];
    }

    return (<Box>
        <DataTable columns={buildDataContent()} data={payments} loading={false} />
        <ClarificationsModal {...clarification} onClose={setClarification} />
        <Divider />
        <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>{`Total: $${total_amount}`}</Typography>
    </Box>)
}

export default PaymentsTable;