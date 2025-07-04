'use client';
import { FC, useEffect, useState } from 'react';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import RoleVerification from '@src/Components/RoleVerification';
import { Button, CardContent, IconButton, Stack, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import CardBox from '@src/Components/Wrappers/CardBox';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import GroupData, { IGroupData, defaultGroupDataState } from './GroupsData';
import Header from '@src/Components/Header';

type TGroupData = {
    id: number;
    title: string;
    type: { id: number, label: string };
    description?: string;
    address?: string;
    active: number;
    properties?: number;
}

const GroupManagement: FC = () => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [groupData, setGroupData] = useState<IGroupData>(defaultGroupDataState);
    const [groups, setGroups] = useState<TGroupData[]>([]);
    const { validateResult } = useDataResponse();

    const getGroups = () => {
        fetchData.get('/properties/groups/groups.php', null, (response: TCallBack) => {
            const groups = validateResult(response.result);
            setGroups(groups || []);
        });
    };

    useEffect(() => {
        getGroups();
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
                dataKey: "type",
                head: {
                    label: "Tipo de Propiedad"
                },
                component: (type: { id: number, label: string }) => {
                    return <Typography variant='body2'>{type.label}</Typography>;
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
                        <IconButton onClick={() => setGroupData({ open: true, group: { ...group, type: group.type.id }})}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ]
    };

    return (<RoleVerification roles={[1,2]}>
        <Header title="GRUPOS DE PROPIEDADES">
            <Button size='small' disabled={loading} onClick={() => setGroupData({ ...defaultGroupDataState, open: true })}>+ NUEVO GRUPO</Button>
        </Header>
        <CardBox>
            <CardContent>
                <DataTable columns={buildDataContent()} data={groups} loading={loading} />
            </CardContent>
        </CardBox>
        <GroupData {...groupData} setGroupData={setGroupData} getGroups={getGroups} />
    </RoleVerification>);
}

export default GroupManagement;