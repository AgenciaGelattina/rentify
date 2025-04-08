'use client';
import { FC, useContext } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import useDataResponse from '@src/Hooks/useDataResponse';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PaymentCollectionRow from './Row';
import { mapKey } from '@src/Utils';
import ContractTypeSelector from '@src/Components/Forms/ContractTypeSelector';
import ContractStateSelector from '@src/Components/Forms/ContractExpiredSelector';
import { StoreContext } from '@src/DataProvider';
import { STATE_ACTIONS } from '@src/Constants';
import { IContractSummary } from '@src/DataProvider/interfaces';
import { isEmpty, isNotEmpty, isNotNil } from 'ramda';

const initialQueryParams: FieldValues = {
    group: null,
    contract_type: null,
    contract_state: null
}

const PaymentCollection: FC = () => {
    const { state, setMainState } = useContext(StoreContext);
    const { summary } = state;
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const filterFormData = useForm({ defaultValues: initialQueryParams });

    const getPaymentCollectionData = (data?: FieldValues) => {
        console.log('FILTER-COLLECTION-DATA', data, summary);
        if (isEmpty(summary.data) || summary.updated || (isNotNil(data) && isNotEmpty(data))) {
            fetchData.get('/properties/contracts/summary.php', data, (response: TCallBack) => {
                const resume = validateResult(response.result);
                setMainState(STATE_ACTIONS.SET_CONTRACTS_SUMMARY, resume);
            });
        };
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
                dataKey: 'contract_type',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <ContractTypeSelector field={field} />
                }
            },
            {
                dataKey: 'contract_state',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <ContractStateSelector field={field} />
                }
            }/*,
            {
                dataKey: 'date',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <MonthYearSelector field={field} />
                }
            }*/
        ]
    };

    return (<>
        <Header title="COBRANZA" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
        <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getPaymentCollectionData} expanded={false} />
        <TableContainer>
            <Table aria-label="collapsible table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Propiedad</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Deuda</TableCell>
                        <TableCell>Fechas de Corte</TableCell>
                        <TableCell>Fecha de Finalización</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summary.data.map((data: IContractSummary, ix:number) => {
                        const { contract, property } = data;
                        return <PaymentCollectionRow key={mapKey("cnt", ix)} contract={contract} property={property} loading={loading} />;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default PaymentCollection;
