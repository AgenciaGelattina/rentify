'use client';
import { FC, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Header, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button, Stack } from '@mui/material';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import PropertyView, { IPropertyView } from '@src/Components/Properties';
import { Wysiwyg } from '@mui/icons-material';

const initialQueryParams: FieldValues = {
    group: null
}

const Properties: FC = () => {
    const [propertyView, setPropertyView] = useState<IPropertyView>({ open: false });
    const { result, fetchData, error, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const filterFormData = useForm({ defaultValues: initialQueryParams });
    const { validateResult } = useDataResponse();

    const getProperties = (data?: FieldValues) => {
        console.log('FILTER-DATA', data);
        fetchData.get('/properties/properties.php', data);
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
                component: (title: string, property: any) => {
                    return (<Button variant='text' onClick={() => setPropertyView({ open: true, property })}>
                        {title}
                    </Button>);
                }
            },
            {
                dataKey: "description",
                head: {
                    label: "Descripción",
                },
                component: (description: number) => {
                    return <Typography variant="body2">{`${description}`}</Typography>;
                }
            },
            {
                dataKey: "type",
                head: {
                    label: "Tipo de propiedad",
                },
                component: (fieldData: { id: number; label: string }) => {
                    return  <Typography>{`${fieldData.label}`}</Typography>;
                }
            },
            {
                dataKey: "status",
                head: {
                    label: "Status",
                },
                component: (fieldData: { id: number; label: string }) => {
                    return  <Typography>{`${fieldData.label}`}</Typography>;
                }
            },
            {
                dataKey: "group",
                head: {
                    label: "Grupo",
                },
                component: (fieldData: { id: number; title: string }) => {
                    if (fieldData.id > 0) {
                        return (<Button variant='text' onClick={() => {
                            filterFormData.setValue('group', fieldData.id);
                            filterFormData.handleSubmit((data) => console.log(data));
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
                component: (property: any) => {
                    return (<Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={() => setPropertyView({ open: true, property })}>
                            <Wysiwyg fontSize="inherit" />
                        </IconButton>
                    </Stack>);
                }
            }
        ]
    }

    return (<>
        <Header title="PROPIEDADES" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
        <CardBox>
            <CardContent>
                <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
                <DataTable columns={buildDataContent()} data={validateResult(result)} loading={loading} />
            </CardContent>
        </CardBox>
        <PropertyView {...propertyView} setOpen={setPropertyView} />
    </>)
};

export default Properties;