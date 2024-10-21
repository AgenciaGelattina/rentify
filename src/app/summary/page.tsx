'use client';
import { FC, useState } from 'react';
import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { FieldValues, useForm } from 'react-hook-form';
import { ConditionalRender, Header, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import DataTable, { IDataTableColumn } from '@src/Components/DataTable';
import CardBox from '@src/Components/Wrappers/CardBox';
import { CardContent, IconButton, Typography, Button, Stack, Accordion, AccordionSummary, AccordionDetails, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import DataFilters, { IDataFilter } from '@src/Components/DataFilters';
import PropertiesGroupsSelector from '@src/Components/Forms/PropertiesGroups';
import { IProperty } from '@src/Components/Properties/Details';
import PaymentsStatuSelector from '@src/Components/Forms/PaymentStatus';
import SummaryDetails, { TSummaryDetails } from './SummaryDetails';
import { ExpandMore, Description } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DATE_FORMAT } from '@src/Constants';
import { IContract } from '@src/Components/Properties/Contracts/Details';
import { IRecurring } from '@src/Components/Properties/Contracts/Payments/Recurring/Detail';
import LabelStatus, { ILabelStatus } from '@src/Components/LabelStatus';
import ResumeRow, { IResumeData } from './ResumeRow';
import { mapKey } from '@src/Utils';

const initialQueryParams: FieldValues = {
    group: null,
    paymen_status: null
}

const ContractsSummary: FC = () => {
  const { state } = useContext(StoreContext);
  const [summaryDetails, setSummaryDetails] = useState<TSummaryDetails>({ open: false });
  const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
  const { validateResult } = useDataResponse();
  const [resumeData, setResumeData] = useState<IResumeData[]>([]);
  const filterFormData = useForm({ defaultValues: initialQueryParams });

  const getProperties = (data?: FieldValues) => {
      console.log('FILTER-RESUME-DATA', data);
      fetchData.get('/properties/contracts/payments/resume.php', data, (response: TCallBack) => {
        const resume = validateResult(response.result);
        setResumeData(resume);
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

  const openContractGeneralView = (property: IProperty, contract: IContract) => {
    setSummaryDetails({ open: true, property, contract });
    console.log('openContractGeneralView', property, contract);
  }

  return (<>
    <Header title="RESUMEN DE CONTRATOS ACTIVOS" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 35 } }} />
    <CardBox>
        <CardContent>
            <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={getProperties} expanded={false} />
            <TableContainer>
                <Table aria-label="collapsible table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Estado</TableCell>
                            <TableCell>Propiedad</TableCell>
                            <TableCell>Cobro Mensual</TableCell>
                            <TableCell>Duda a Cobrar</TableCell>
                            <TableCell>Meses de Deuda</TableCell>
                            <TableCell>Fecha de Corte</TableCell>
                            <TableCell>Fecha de Vencimiento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumeData.map((data: IResumeData, ix:number) => {
                            return <ResumeRow key={mapKey("cnt", ix)} {...data} openContractGeneralView={openContractGeneralView} />
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </CardContent>
    </CardBox>
    <SummaryDetails {...summaryDetails} setOpen={setSummaryDetails} />
  </>);

}

export default ContractsSummary;
