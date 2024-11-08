import { FC, useEffect, useState } from 'react';
import { IProperty } from '@src/Components/Properties/Details';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import { IconButton, Stack, Typography } from '@mui/material';
import { formatDate } from '@src/Utils';
import { DATE_FORMAT } from '@src/Constants';
import { Description } from '@mui/icons-material';
import { IContract } from '@src/Components/Properties/Contracts/Details';
import ExpiredContractDetails, { IExpiredContractSummary } from './Details';
import RenewContract, { IRenewContractModal } from '../ContractForm/Renew';

interface IExpiredContractsProps {
    property: IProperty;
    getProperties: () => void;
}

const ExpiredContracts: FC<IExpiredContractsProps> = ({ property, getProperties }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [expiredContracts, setExpiredContracts] = useState<IContract[]>([]);
    const [expiredContract, setExpiredContract] = useState<IExpiredContractSummary>({ open: false });
    const [renewContract, setRenewContract] = useState<IRenewContractModal>({ open: false });
    const { validateResult } = useDataResponse();

    const getContractsList = () => {
        setExpiredContracts([]);
        if (property && property.id > 0) {
            fetchData.get('/properties/contracts/list.php', { property_id: property.id, type: "expired" }, (response: TCallBack) => {
                const contracts = validateResult(response.result);
                if (contracts) {
                    setExpiredContracts(contracts);
                }
            });
        }
    }

    useEffect(() => {
        getContractsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    const buildDataContent = (): IDataTableColumn[] => {
        return [
            {
                dataKey: "id",
                head: {
                    label: "#",
                    width: '20px',
                    align: 'center'
                },
                component: (id: number) => {
                    return <Typography variant="subtitle2">{`#${id}`}</Typography>;
                }
            },
            {
                head: {
                    label: "",
                },
                component: (rowData: IContract) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => { setExpiredContract({ open: true, contract: rowData, property }) }}>
                            <Description fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            },
            {
                dataKey: "start_date",
                head: {
                    label: "Inicio",
                },
                component: (start_date: string) => {
                    return <Typography variant='subtitle2'>{`${formatDate(start_date, DATE_FORMAT.MONTH_YEAR)}`}</Typography>;
                }
            },
            {
                dataKey: "end_date",
                head: {
                    label: "Finalización",
                },
                component: (end_date: string, rowData: any) => {
                    return <Typography variant='subtitle2'>{`${formatDate(end_date, DATE_FORMAT.MONTH_YEAR)}`}</Typography>;
                }
            },
            {
                head: {
                    label: "Estado",
                },
                component: (contract: IContract) => {
                    const { canceled } = contract;
                    if (canceled) {
                        return <Typography color="error" variant='subtitle2'>Cancelado</Typography>;
                    }
                    return <Typography color="danger" variant='subtitle2'>Expirado</Typography>;
                }
            }
        ];
    }

    const onRenewContract = (contract: IContract) => {
        setRenewContract({ open: true, contract, property })
    }

    return (<>
        <DataTable columns={buildDataContent()} data={expiredContracts} loading={loading} />
        <ExpiredContractDetails {...expiredContract} setOpen={setExpiredContract} getContractsList={getContractsList} getProperties={getProperties} onRenewContract={onRenewContract} />
        <RenewContract {...renewContract} setOpen={setRenewContract} />
    </>)
}

export default ExpiredContracts;