'use client';
import { FC, useContext, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Event } from '@mui/icons-material';
import { formatDate, mapKey, TDate } from '@src/Utils';
import { StoreContext } from '@src/DataProvider';
import { DATE_FORMAT, STATE_ACTIONS } from '@src/Constants';
import { isNotEmpty, isNotNil } from 'ramda';
import MonthYearSelector from '@src/Components/Forms/MonthYearSelector';
import PaymentCollectionRow from './Row';
import { IPaymentCollection } from './Details';
import Header from '@src/Components/Header';

const initialQueryParams: FieldValues = {
    group: null,
    date: new Date()
};

const PaymentCollection: FC = () => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const filterFormData = useForm<FieldValues>({ defaultValues: initialQueryParams });
    const [selectedDate, setSelectedDate] = useState<Date>(new Date);
    const [paymentCollections, setPaymentCollections] = useState<IPaymentCollection[]>([]);

    const getPaymentCollectionData = (data?: FieldValues) => {
        const paramsData = (isNotNil(data) && isNotEmpty(data)) ? data : filterFormData.getValues();
        const params = { account:user.id, group: paramsData.group, year: paramsData.date.getFullYear(), month: paramsData.date.getMonth() + 1 };
        setSelectedDate(paramsData.date);
        fetchData.get('/properties/contracts/payments/collection/summary.php', params, (response: TCallBack) => {
            const paymentColection = validateResult(response.result);
            setPaymentCollections(paymentColection);
        });
    };

    const buildDataFilters = (): IDataFilter[] => {
        return [
            {
                dataKey: 'group',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <PropertiesGroupsSelector field={field} />
                }
            },
            {
                dataKey: 'date',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <MonthYearSelector field={field} />
                }
            }
        ];
    };

    return (<>
        <Header title="COBRANZA" subTitle={`${user?.role?.label}: ${user.fullName}`}/>
        <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getPaymentCollectionData} expanded={false} />

        <TableContainer sx={{ paddingTop: '.5rem' }}>
            <Box sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Event />
                <Typography sx={{ marginLeft: '.5rem' }} variant="h6">{`${formatDate(selectedDate, DATE_FORMAT.MONTH_YEAR)}`}</Typography>
            </Box>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Propiedad</TableCell>
                        <TableCell>Cargos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentCollections.map((pc: IPaymentCollection, ix: number) => {
                        return <PaymentCollectionRow key={mapKey("pc", ix)} paymentCollection={pc} selectedDate={selectedDate} getPaymentCollectionData={getPaymentCollectionData} />;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default PaymentCollection;
