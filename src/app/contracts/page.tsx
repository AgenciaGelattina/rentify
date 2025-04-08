'use client';
import { FC } from 'react';
import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { FieldValues, useForm } from 'react-hook-form';
import useDataResponse from '@src/Hooks/useDataResponse';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import PaymentsStatuSelector from '@src/Components/Forms/PaymentStatus';
import SummaryDetails from './Details';
import { STATE_ACTIONS } from '@src/Constants';
import { IContract } from '@src/Components/Properties/Contracts/Details';
import ResumeRow from './Row';
import { mapKey } from '@src/Utils';
import ContractTypeSelector from '@src/Components/Forms/ContractTypeSelector';
import ContractStateSelector from '@src/Components/Forms/ContractExpiredSelector';
import { IContractSummary } from '@src/DataProvider/interfaces';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import { isEmpty, isNotEmpty, isNotNil } from 'ramda';

const initialQueryParams: FieldValues = {
    group: null,
    paymen_status: null
};

const ContractsSummary: FC = () => {
    const { state, setMainState } = useContext(StoreContext);
    const { summary } = state;
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const filterFormData = useForm({ defaultValues: initialQueryParams });

    const loadSummaryData = (data?: FieldValues) => {
        console.log('FILTER-RESUME-DATA', data);
        //if (isEmpty(summary.data) || (isNotNil(data) && isNotEmpty(data))) {
            fetchData.get('/properties/contracts/summary.php', data, (response: TCallBack) => {
                const resume = validateResult(response.result);
                setMainState(STATE_ACTIONS.SET_CONTRACTS_SUMMARY, resume);
            });
        //};
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
                dataKey: 'payment_status',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <PaymentsStatuSelector field={field} />
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
            }
        ]
    }

    return (<>
        <Header title="RESUMEN DE CONTRATOS ACTIVOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
        <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={loadSummaryData} expanded={false} />
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
                        return <ResumeRow key={mapKey("cnt", ix)} contract={contract} property={property} loading={loading} setMainState={setMainState} />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default ContractsSummary;
