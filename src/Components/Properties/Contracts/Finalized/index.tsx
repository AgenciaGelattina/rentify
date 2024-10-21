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
import FinalizedContractDetails, { IFinalizedContractSummary } from './Details';

type TFinalizedContracts = {
    property: IProperty;
}

const FinalizedContracts: FC<TFinalizedContracts> = ({ property }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [finalizedContracts, setFinalizedContracts] = useState<IContract[]>([]);
    const [finalizedContract, setFinalizedContract] = useState<IFinalizedContractSummary>({ open: false });
    const { validateResult } = useDataResponse();

    const getContractsList = () => {
        if (property && property.id > 0) {
            fetchData.get('/properties/contracts/list.php', { property_id: property.id, type: "finalized" }, (response: TCallBack) => {
                const contracts = validateResult(response.result);
                if (contracts) {
                    setFinalizedContracts(contracts);
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
                        <IconButton onClick={() => { setFinalizedContract({ open: true, contract: rowData, property }) }}>
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
            }
        ];
    }

    return (<>
        <DataTable columns={buildDataContent()} data={finalizedContracts} loading={loading} />
        <FinalizedContractDetails {...finalizedContract} setOpen={setFinalizedContract} getContractsList={getContractsList} />
    </>)
}

export default FinalizedContracts;