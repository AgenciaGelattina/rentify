import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import { Edit, DeleteForever, Description, CheckBox } from '@mui/icons-material';
import { FC, useContext, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT, PAYMENT_TYPE } from '@src/Constants';
import ClarificationsModal,{ TClarificationsModal, descriptionModalDefault } from './Clarifications';
import { isEmpty, isNotNil } from 'ramda';
import { NumericFormat } from 'react-number-format';
import { ConditionalRender, TCallBack, useFetchData } from '@phoxer/react-components';
import { IPayment } from '..';
import { StoreContext } from '@src/DataProvider';

export interface IPaymentsData {
    payments: IPayment[];
    total_amount: number;
}

export const paymentDataDefault: IPaymentsData = { payments: [], total_amount: 0 };

interface IPaymentsListProps {
    paymentsData: IPaymentsData;
    isLoading: boolean;
    removePayment: (id: number) => void;
    editPayment: (payment: IPayment) => void;
    confirmPayment: (id: number, confirmed: number) => void;
}

const PaymentsList: FC<IPaymentsListProps> = ({ paymentsData = paymentDataDefault, isLoading, editPayment, removePayment, confirmPayment }) => {
    const { state: { user } } = useContext(StoreContext);
    const [clarification, setClarification] = useState<TClarificationsModal>(descriptionModalDefault);

    const isAdmin = user.role < 3;
    const isEditor = user.role > 3;

    const buildDataContent = (): IDataTableColumn[] => {
        return [
            {
                head: {
                    label: "",
                },
                component: (payment: IPayment) => {
                    return (<Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                        {isEditor && <CheckBox color={payment.confirmed ? 'success' : 'warning'} fontSize="inherit" />}
                        {isAdmin && (<IconButton color={payment.confirmed ? 'success' : 'warning'} onClick={() => confirmPayment(payment.id, payment.confirmed ? 0 : 1)}>
                            <CheckBox fontSize="inherit" />
                        </IconButton>)}
                        {(isAdmin || (isEditor && !payment.confirmed)) && (<IconButton onClick={() => editPayment(payment)}>
                            <Edit fontSize="inherit" />
                        </IconButton>)}
                        {!isEmpty(payment.clarifications) && (<IconButton onClick={() => setClarification({ open: true, clarification: payment.clarifications })}>
                            <Description fontSize="inherit" />
                        </IconButton>)}
                        
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
                    if (isAdmin || (isEditor && !payment.confirmed)) {
                        return (<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        <IconButton onClick={() => removePayment(payment.id)}>
                                <DeleteForever fontSize="inherit" color="error" />
                            </IconButton>
                        </Stack>);
                    }
                    return null;
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