'use client';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import RoleVerification from '@src/Components/RoleVerification';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button, Stack } from '@mui/material';
import PropertyData, { IPropertyData } from './PropertyData';
import PropertyContract, { IPropertyContract } from './PropertyContract';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import { AddCircle, Edit, Description } from '@mui/icons-material';

const initialQueryParams: FieldValues = {
    group: null
}

const PropertiesManagement: FC = () => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const filterFormData = useForm({ defaultValues: initialQueryParams });
    const [propertyData, setPropertyData] = useState<IPropertyData>({ open: false, id: 0 });
    const [properties, setProperties] = useState<IPropertyData[]>([]);
    const [propertyContract, setPropertyContract] = useState<IPropertyContract>({ open: false });
    const { validateResult } = useDataResponse();

    const getProperties = (data?: FieldValues) => {
        fetchData.get('/properties/properties.php', data, (response: TCallBack) => {
            const properties = validateResult(response.result);
            setProperties(properties || []);
        });
    }

    const buildDataFilters = (): IDataFilter[] => {
        return [
            {
                dataKey: 'group',
                gridItemProps: { xs: 12 },
                component: (field) => {
                    return <PropertiesGroupsSelector {...field} />
                }
            }
        ]
    }

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
                    label: "Propiedad",
                },
                component: (title: string, rowData: any) => {
                    return <Typography variant='subtitle2'>{`${title}`}</Typography>;
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
                            getProperties(filterFormData.getValues());
                        }}>
                            {fieldData.title}
                        </Button>);
                    }
                    return "";
                }
            },
            {
                head: {
                    label: "",
                },
                component: (rowData: any) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => setPropertyData({ open: true, id: rowData.id })}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => setPropertyContract({ open: true, property: rowData })}>
                            <Description fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ]
    }

    return (<RoleVerification role={1}>
        <Header title="ADMINISTRACIÓN DE PROPIEDADES" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }}>
            <IconButton onClick={() => setPropertyData({ open: true, id: 0 })}>
                <AddCircle fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        <CardBox>
            <CardContent>
                <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
                <DataTable columns={buildDataContent()} data={properties} loading={loading} />
            </CardContent>
        </CardBox>
        <PropertyData {...propertyData} setOpen={setPropertyData} getProperties={getProperties} />
        <PropertyContract {...propertyContract} setOpen={setPropertyContract} />
    </RoleVerification>)
};

export default PropertiesManagement;