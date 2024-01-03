'use client';
import { FC, useState } from 'react';
import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { FieldValues, useForm } from 'react-hook-form';
import { Header, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { TDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button, Stack } from '@mui/material';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import PropertyView, { IPropertyView } from '@src/Components/Properties';
import { Wysiwyg } from '@mui/icons-material';
import PageWrapper from '@src/Components/Wrappers/Page';
import { TPropertyDetails } from '@src/Components/Properties/Details';
import PaymentsStatuSelector from '@src/Components/Forms/PaymentStatus';

const initialQueryParams: FieldValues = {
    group: null,
    paymen_status: null
}

type TContract = {
  id: number;
  due_date: Date;
  value: number;
  property: TPropertyDetails;
}

const Payments: FC = () => {
  const { state } = useContext(StoreContext);
  const [propertyView, setPropertyView] = useState<IPropertyView>({ open: false });
  const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
  const { validateResult } = useDataResponse();
  const [contracts, setContracts] = useState<TContract[]>([]);
  const filterFormData = useForm({ defaultValues: initialQueryParams });

  const getProperties = (data?: FieldValues) => {
      console.log('FILTER-DATA', data);
      fetchData.get('/properties/contracts/payments/resume.php', data, (response: TCallBack) => {
        const contractsData = validateResult(response.result);
        setContracts(contractsData);
      });
  }

  const buildDataFilters = (): IDataFilter[] => {
      return [
          {
              dataKey: 'group',
              gridItemProps: { xs: 12, sm: 6 },
              component: (field) => {
                  return <PropertiesGroupsSelector {...field} />
              }
          },
          {
            dataKey: 'payment_status',
            gridItemProps: { xs: 12, sm: 6 },
            component: (field) => {
                return <PaymentsStatuSelector {...field} />
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
            dataKey: "Estado",
            head: {
                label: "Estado"
            },
            component: (id: number) => {
                return <Typography variant="subtitle2">--</Typography>;
            }
          },
          {
            dataKey: "property",
            head: {
                label: "Grupo",
            },
            component: (property: TPropertyDetails) => {
                const { id, title } = property.group;
                if (id > 0) {
                    return (<Button variant='text' onClick={() => {
                        filterFormData.setValue('group', id);
                        getProperties(filterFormData.getValues());
                    }}>
                        {title}
                    </Button>);
                }
                return "";
            }
          },
          {
              dataKey: "property",
              head: {
                  label: "Propiedad",
              },
              component: (property: TPropertyDetails) => {
                  return (<Button variant='text' onClick={() => setPropertyView({ open: true, property })}>
                      {property.title}
                  </Button>);
              }
          },
          {
              dataKey: "due_date",
              head: {
                  label: "Fecha de Corte",
              },
              component: (due_date: string) => {
                  return  <Typography>{`${due_date}`}</Typography>;
              }
          },
          
          {
              head: {
                  label: "",
              },
              component: (contract: TContract) => {
                  return (<Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton onClick={() => setPropertyView({ open: true, property: contract.property })}>
                          <Wysiwyg fontSize="inherit" />
                      </IconButton>
                  </Stack>);
              }
          }
      ]
  }

  return (<PageWrapper navigation>
    <Header title="PROPIEDADES" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
    <CardBox>
        <CardContent>
            <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
            <DataTable columns={buildDataContent()} data={contracts} loading={loading} />
        </CardContent>
    </CardBox>
    <PropertyView {...propertyView} setOpen={setPropertyView} />
  </PageWrapper>)
}

export default Payments;