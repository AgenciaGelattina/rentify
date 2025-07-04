'use client';
import { FC, useEffect, useState } from 'react';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import RoleVerification from '@src/Components/RoleVerification';
import { CardContent, IconButton, Stack, Typography } from '@mui/material';
import { AddCircle, Edit } from '@mui/icons-material';
import CardBox from '@src/Components/Wrappers/CardBox';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import TypeData, { ITypeData, TTypeData, defaultTypeDataState } from './TypesData';
import Header from '@src/Components/Header';

const TypesManagement: FC = () => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [typeData, setTypeData] = useState<ITypeData>(defaultTypeDataState);
    const [propertiesStatus, setPropertiesStatus] = useState<ITypeData[]>([]);
    const { validateResult } = useDataResponse();

    const getTypes = () => {
        fetchData.get('/properties/statuses/statuses.php', null, (response: TCallBack) => {
            const status = validateResult(response.result);
            setPropertiesStatus(status || []);
        });
    }

    useEffect(() => {
        getTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                dataKey: "label",
                head: {
                    label: "Estado de la Propiedad"
                },
                component: (label: string) => {
                    return <Typography>{label}</Typography>;
                }
            },
            {
                head: {
                    label: "",
                    width: '20px'
                },
                component: (type: TTypeData) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => setTypeData({ open: true, type })}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ]
    };

    return (<RoleVerification roles={[1,2]}>
        <Header title="ESTADOS DE LAS PROPIEDADES">
            <IconButton onClick={() => setTypeData({ ...defaultTypeDataState, open: true })}>
                <AddCircle fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        <CardBox>
            <CardContent>
                <DataTable columns={buildDataContent()} data={propertiesStatus} loading={loading} />
            </CardContent>
        </CardBox>
        <TypeData {...typeData} setTypeData={setTypeData} getTypes={getTypes} />
    </RoleVerification>);
}

export default TypesManagement;