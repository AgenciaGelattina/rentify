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
import ExpiredContractDetails, { TExpiredContractSummary } from './Details';

type TExpiredContracts = {
    property: IProperty;
}

const ExpiredContracts: FC<TExpiredContracts> = ({ property }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [expiredContracts, setExpiredContracts] = useState<IContract[]>([]);
    const [expiredContract, setExpiredContract] = useState<TExpiredContractSummary>({ open: false });
    const { validateResult } = useDataResponse();

    useEffect(() => {
        if (property && property.id > 0) {
            fetchData.get('/properties/contracts/expired.php', { property_id: property.id }, (response: TCallBack) => {
                const contracts = validateResult(response.result);
                if (contracts) {
                    setExpiredContracts(contracts);
                }
            });
        }
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
                dataKey: "end_date",
                head: {
                    label: "Exirado",
                },
                component: (end_date: string, rowData: any) => {
                    return <Typography variant='subtitle2'>{`${formatDate(end_date, DATE_FORMAT.MONTH_YEAR)}`}</Typography>;
                }
            },
            {
                dataKey: "in_debt",
                head: {
                    label: "Estado"
                },
                component: (in_debt: boolean) => {
                    const label = in_debt ? "CON DEUDA" : "SALDADO";
                    return <Typography variant="subtitle2" color={in_debt ? "error" : "success"}>{label}</Typography>;
                }
              },
            {
                head: {
                    label: "",
                },
                component: (rowData: any) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => { setExpiredContract({ open: true, contract: rowData }) }}>
                            <Description fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ];
    }

    return (<>
        <DataTable columns={buildDataContent()} data={expiredContracts} loading={loading} />
        <ExpiredContractDetails {...expiredContract} setOpen={setExpiredContract} />
    </>)
}

export default ExpiredContracts;