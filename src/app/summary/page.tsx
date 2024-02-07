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
import { TPropertyDetails } from '@src/Components/Properties/Details';
import PaymentsStatuSelector from '@src/Components/Forms/PaymentStatus';
import SummaryDetails, { TSummaryDetails } from './SummaryDetails';
import { Wysiwyg } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT } from '@src/Constants';


const initialQueryParams: FieldValues = {
    group: null,
    paymen_status: null
}

type TContract = {
  id: number;
  value: number;
  start_date: string;
  end_date: string;
  due_date: string;
  current_months: number;
  total_months: number;
  pending_months: number;
  in_debt: boolean;
  rent_is_due: boolean;
  debt: number;
  property: TPropertyDetails;
}

const ContractsSummary: FC = () => {
  const { state } = useContext(StoreContext);
  const [summaryDetails, setSummaryDetails] = useState<TSummaryDetails>({ open: false });
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
            dataKey: "in_debt",
            head: {
                label: "Estado"
            },
            component: (in_debt: boolean) => {
                const label = in_debt ? "CON DEUDA" : "SALDADO";
                return <Typography variant="subtitle2" color={in_debt ? "error" : "success"}>{label}</Typography>;
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
            head: {
                label: "Propiedad",
            },
            component: ({ property, ...rest }: TContract) => {
                return (<Button variant='text' onClick={() => setSummaryDetails({ open: true, property, contract: rest })}>
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
                return  <Typography>{`${format(new Date(due_date), DATE_FORMAT.DATE_LONG, { locale: es })}`}</Typography>;
            }
          },
          {
            head: {
                label: "",
            },
            component: ({ property, ...rest }: TContract) => {
            return (<Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => setSummaryDetails({ open: true, property, contract: rest })}>
                    <Wysiwyg fontSize="inherit" />
                </IconButton>
            </Stack>);
            }
          }
      ]
  }

  return (<>
    <Header title="RESUMEN DE CONTRATOS ACTIVOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
    <CardBox>
        <CardContent>
            <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
            <DataTable columns={buildDataContent()} data={contracts} loading={loading} />
        </CardContent>
    </CardBox>
    <SummaryDetails {...summaryDetails} setOpen={setSummaryDetails} />
  </>)
}

export default ContractsSummary;