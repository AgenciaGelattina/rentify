import { FC, useContext, useEffect, useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { GroupAdd, Edit, DeleteForever } from '@mui/icons-material';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import ContractorForm, { TContractorForm } from './ContractorForm';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import { StoreContext } from '@src/DataProvider';
import { IContractor } from './Details';
import Header from '@src/Components/Header';


interface IContractContractorsProps {
    contract: { id: number };
};

const ContractContractors: FC<IContractContractorsProps> = ({ contract }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractorForm, setContractorForm] = useState<TContractorForm>({ contract_id: contract.id, open: false });
    const [contractors, setContractors] = useState<IContractor[]>([]);

    const canEdit = user.role && (user.role.id < 3);

    const getContractors = ( ) => {
        fetchData.get('/properties/contracts/contractors/contractors.php', { contract_id: contract.id }, (response: TCallBack) => {
            const contractors = validateResult(response.result);
            if (contractors) {
                setContractors(contractors);
            }
        });
    }

    const removeContractor = (id: number) => {
        fetchData.delete('/properties/contracts/contractors/contractors.php', { id }, (response: TCallBack) => {
            const deleted = validateResult(response.result);
            if (deleted) {
                getContractors();
            }
        });
    }
    
    useEffect(() => {
        getContractors();
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
                head: {
                    label: "Nombre"
                },
                component: ({ names, surnames }: IContractor) => {
                    return <Typography variant="body2">{`${names} ${surnames}`}</Typography>;
                }
            },
            {
                dataKey: "email",
                head: {
                    label: "Email"
                },
                component: (email: string) => {
                    return <Typography variant="body2">{email}</Typography>;
                }
            },
            {
                dataKey: "phone",
                head: {
                    label: "Teléfono"
                },
                component: (phone: string) => {
                    return <Typography variant="body2">{phone}</Typography>;
                }
            },
            {
                head: {
                    label: "",
                },
                component: (contractor: IContractor) => {
                    if (!canEdit) {
                        return null;
                    }
                    return (<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        <IconButton onClick={() => setContractorForm({ contractor, contract_id: contract.id, open: true })}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => removeContractor(contractor.id)}>
                            <DeleteForever fontSize="inherit" color="error" />
                        </IconButton>
                    </Stack>);
                }
            }
        ];
    }

    return (<Box sx={{ border: '1px solid #ccc', padding: '1rem' }}>
        <Header title="CONTACTOS">
            {canEdit && <IconButton onClick={() => setContractorForm({ contract_id: contract.id, open: true })}>
                <GroupAdd fontSize="inherit" color='primary' />
            </IconButton>}
        </Header>
        <DataTable columns={buildDataContent()} data={contractors} loading={loading} />
        {canEdit && <ContractorForm {...contractorForm} setOpen={setContractorForm} getContractors={getContractors} />}
    </Box>)
}

export default ContractContractors;