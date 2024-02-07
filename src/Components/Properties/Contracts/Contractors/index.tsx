import { FC, useEffect, useState } from 'react';
import { TContractDetails } from '../Details';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { GroupAdd, Edit, DeleteForever } from '@mui/icons-material';
import { ConditionalRender, Header, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import ContractorForm, { IContractor, TContractorForm } from './ContractorForm';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';


type TContractContractors = {
    contract: { id: number };
    editMode: boolean;
}

const ContractContractors: FC<TContractContractors> = ({ contract, editMode }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractorForm, setContractorForm] = useState<TContractorForm>({ contract_id: contract.id, open: false });
    const [contractors, setContractors] = useState<IContractor[]>([]);

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
                    if (!editMode) {
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
        <Header title="INQUILINOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            <ConditionalRender condition={editMode} >
                <IconButton onClick={() => setContractorForm({ contract_id: contract.id, open: true })}>
                    <GroupAdd fontSize="inherit" color='primary' />
                </IconButton>
            </ConditionalRender>
        </Header>
        <DataTable columns={buildDataContent()} data={contractors} loading={loading} />
        <ConditionalRender condition={editMode} >
            <ContractorForm {...contractorForm} setOpen={setContractorForm} getContractors={getContractors} />
        </ConditionalRender>
    </Box>)
}

export default ContractContractors;