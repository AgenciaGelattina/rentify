'use client';
import { FC, useEffect, useState } from 'react';
import { Header, useFetchData } from '@phoxer/react-components';
import RoleVerification from '@src/Components/RoleVerification';
import { CardContent, IconButton, Stack, Typography } from '@mui/material';
import { AddCircle, Edit } from '@mui/icons-material';
import CardBox from '@src/Components/Wrappers/CardBox';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import GroupData, { IGroupData, TGroupData, defaultGroupDataState } from './GroupsData';

const GroupManagement: FC = () => {
    const { result, fetchData, error, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [groupData, setGroupData] = useState<IGroupData>(defaultGroupDataState);

    const getGroups = () => {
        fetchData.get('/properties/groups/groups.php');
    }

    useEffect(() => {
        getGroups();
    }, []);

    console.log(result)

    const buildDataContent = (): TDataTableColumn[] => {
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
                dataKey: "title",
                head: {
                    label: "Grupo"
                },
                component: (title: string) => {
                    return <Typography>{title}</Typography>;
                }
            },
            {
                dataKey: "description",
                head: {
                    label: "Descripción"
                },
                component: (description: string) => {
                    return <Typography variant='body2'>{description}</Typography>;
                }
            },
            {
                dataKey: "properties",
                head: {
                    label: "Propiedades",
                    align: 'center'
                },
                component: (properties: number) => {
                    return <Typography sx={{ textAlign: 'center' }}>{properties}</Typography>;
                }
            },
            {
                head: {
                    label: "",
                    width: '20px'
                },
                component: (group: TGroupData) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => setGroupData({ open: true, group})}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ]
    };

    return (<RoleVerification role={1}>
        <Header title="GRUPOS DE PROPIEDADES" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }}>
            <IconButton onClick={() => setGroupData({ ...defaultGroupDataState, open: true })}>
                <AddCircle fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        <CardBox>
            <CardContent>
                <DataTable columns={buildDataContent()} data={result} loading={loading} />
            </CardContent>
        </CardBox>
        <GroupData {...groupData} setGroupData={setGroupData} getGroups={getGroups} />
    </RoleVerification>);
}

export default GroupManagement;