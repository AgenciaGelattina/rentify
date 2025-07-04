'use client';
import { FC, useEffect } from 'react';
import RoleVerification from '@src/Components/RoleVerification';
import { useFetchData } from '@phoxer/react-components';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button } from '@mui/material';
import { PersonAdd, Edit, CheckCircle, Cancel } from '@mui/icons-material';
import Header from '@src/Components/Header';

const AccountsRoles: FC = () => {
    const { result, fetchData, error, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);

    const getRoles = () => {
        fetchData.get('/accounts/roles.php');
    }

    useEffect(() => {
        getRoles();
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
                    label: "Rol De Usario",
                },
                component: (label: string) => {
                    return <Typography>{label}</Typography>;
                }
            },
            
        ]
    }

    return (<RoleVerification roles={[1,2]}>
        <Header title="ROLES DE USUARIO">
            <IconButton>
                <PersonAdd fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        <CardBox>
            <CardContent>
                <DataTable columns={buildDataContent()} data={result} loading={loading} />
            </CardContent>
        </CardBox>
    </RoleVerification>)
};

export default AccountsRoles;