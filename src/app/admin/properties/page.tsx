'use client';
import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import RoleVerification from '@src/Components/RoleVerification';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button, Stack, Menu, MenuItem } from '@mui/material';
import PropertyData, { IPropertyData } from './PropertyData';
import PropertyContract, { IPropertyContract } from './PropertyContract';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import { Edit, Description, Assignment, MoreVert } from '@mui/icons-material';
import { IProperty } from '@src/Components/Properties/Details';
import Header from '@src/Components/Header';
import AccountAssignment from './AccountAssignment';

const initialQueryParams: FieldValues = {
    group: null
};

const PropertiesManagement: FC = () => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const filterFormData = useForm({ defaultValues: initialQueryParams });
    const [propertyData, setPropertyData] = useState<IPropertyData>({ open: false, id: 0 });
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [propertyContract, setPropertyContract] = useState<IPropertyContract>({ open: false });
    const [accountAssignment, setAccountAssignment] = useState<IPropertyContract>({ open: false });
    const { validateResult } = useDataResponse();

    const getProperties = () => {
        const data = filterFormData.getValues();
        fetchData.get('/properties/properties.php', data, (response: TCallBack) => {
            const properties = validateResult(response.result);
            setProperties(properties || []);
        });
    }

    const buildDataFilters = (): IDataFilter[] => {
        return [
            {
                dataKey: 'group',
                gridItemProps: { size: { xs: 12 } },
                component: (field) => {
                    return <PropertiesGroupsSelector field={field} />
                }
            }
        ]
    }

    const buildDataContent = (): IDataTableColumn[] => {
        return [
            {
                head: {
                    label: "Propiedad",
                },
                component: (rowData: IProperty) => {
                    const { title, assignment, active_contract } = rowData;
                    return (<Stack direction="column" alignItems="start">
                        <Button variant="text" sx={{color: '#000'}} startIcon={<Edit color='primary' fontSize="inherit" />} onClick={() => setPropertyData({ open: true, id: rowData.id })}>{title}</Button>
                        <Button size='small' variant="text" sx={{fontSize: '10px'}} startIcon={<Description fontSize="inherit" />} color={active_contract ? 'info' : 'warning' } onClick={() => setPropertyContract({ open: true, property: rowData })}>
                           {active_contract ? "Contrato Activo" : "Sin Contrato"}
                        </Button>
                        <Button size='small' variant="text" sx={{fontSize: '10px'}} color={assignment ? 'info' : 'warning' } startIcon={<Assignment fontSize="inherit" />} onClick={() => setAccountAssignment({ open: true, property: rowData })}>{assignment ? `${assignment?.role.label}: ${assignment.name} ${assignment.surname}` : "Sin Asignación"}</Button>
                    </Stack>);
                }
            },
            {
                dataKey: "description",
                head: {
                    label: "Descripción",
                },
                component: (description: number) => {
                    return <Typography variant='body2'>{`${description}`}</Typography>;
                }
            },
            {
                dataKey: "type",
                head: {
                    label: "Tipo de propiedad",
                },
                component: (fieldData: { id: number; label: string }) => {
                    return <Typography>{`${fieldData.label}`}</Typography>;
                }
            },
            {
                dataKey: "status",
                head: {
                    label: "Status",
                },
                component: (fieldData: { id: number; label: string }) => {
                    return <Typography>{`${fieldData.label}`}</Typography>;
                }
            },
            {
                dataKey: "group",
                head: {
                    label: "Grupo",
                },
                component: (fieldData: { id: number; title: string }) => {
                    if (fieldData.id > 0) {
                        return (<Button variant='text' sx={{ textAlign: 'left'}} onClick={() => {
                            filterFormData.setValue('group', fieldData.id);
                            getProperties();
                        }}>
                            {fieldData.title}
                        </Button>);
                    }
                    return "";
                }
            }
        ]
    }

    return (<RoleVerification roles={[1,2]}>
        <Header title="ADMINISTRACIÓN DE PROPIEDADES">
            <Button size='small' disabled={loading} onClick={() => setPropertyData({ open: true, id: 0 })}>+ NUEVA PROPIEDAD</Button>
        </Header>
        <CardBox>
            <CardContent>
                <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
                <DataTable columns={buildDataContent()} data={properties} loading={loading} />
            </CardContent>
        </CardBox>
        <PropertyData {...propertyData} setOpen={setPropertyData} getProperties={getProperties} />
        <PropertyContract {...propertyContract} setOpen={setPropertyContract} getProperties={getProperties} />
        <AccountAssignment {...accountAssignment} setOpen={setAccountAssignment} getProperties={getProperties} />
    </RoleVerification>)
};

export default PropertiesManagement;