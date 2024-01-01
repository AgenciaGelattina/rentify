'use client';
import { useEffect, useState } from 'react';
import RoleVerification from '@src/Components/RoleVerification';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button } from '@mui/material';
import UserForm, { TUserForm } from './UserForm';
import { PersonAdd, Edit, CheckCircle, Cancel } from '@mui/icons-material';
import { IRole } from '@src/Components/Forms/RolesSelector';
import useDataResponse from '@src/Hooks/useDataResponse';

const AccountsManagement: React.FC = () => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [users, setUsers] = useState<any>([]); 
    const { validateResult } = useDataResponse();
    const [userForm, setUserForm] = useState<TUserForm>({ open: false, id: 0 });

    const getUsers = () => {
        fetchData.get('/accounts/users.php', null, (response: TCallBack) => {
            const users = validateResult(response.result);
            if (users) {
                setUsers(users);
            }
        });
    }

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleUserActive = ({ id, active }: { id: number; active: number }) => {
        fetchData.post('/accounts/active.php', { id, active }, (response: TCallBack) => {
            const users = validateResult(response.result);
            if (users) {
                setUsers(users);
            }
        });
    }

    console.log('RENDER')

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
                dataKey: "full_name",
                head: {
                    label: "Nombre",
                },
                component: (name: string, data: any) => {
                    return (<Button variant='text' startIcon={<Edit />} onClick={() => setUserForm({ open: true, id: data.id })}>
                        {name}
                    </Button>);
                }
            },
            {
                dataKey: "email",
                head: {
                    label: "Correo Electrónico",
                },
                component: (email: string) => {
                    return <Typography>{email}</Typography>;
                }
            },
            {
                dataKey: "role",
                head: {
                    label: "Permisos",
                },
                component: (role: IRole) => {
                    return <Typography>{role.label}</Typography>;
                }
            },
            {
                dataKey: "active",
                head: {
                    label: "Activo",
                    align: 'center'
                },
                cell: {
                    align: 'center'
                },
                component: (active: number, data: any) => {
                    return (<IconButton size="small" onClick={() => toggleUserActive({ id: data.id, active })}>
                        {(active === 1) ? <CheckCircle color='success' /> : <Cancel color='error' />}
                    </IconButton>)
                }
            }
        ]
    }

    return (<RoleVerification role={1}>
        <Header title="ADMINISTRACIÓN DE CUENTAS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }}>
            <IconButton onClick={() => setUserForm({ open: true, id: 0 })}>
                <PersonAdd fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        <CardBox>
            <CardContent>
                <DataTable columns={buildDataContent()} data={users} loading={loading} />
            </CardContent>
        </CardBox>
        <UserForm {...userForm} setOpen={setUserForm} getUsers={getUsers} />
    </RoleVerification>)
};

export default AccountsManagement;