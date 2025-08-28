"use client"
import { FC, useContext, useState } from "react";
import { IPageLayout } from "@src/Constants";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import Header from '@src/Components/Header';
import useDataResponse from "@src/Hooks/useDataResponse";
import { FieldValues, useForm } from "react-hook-form";
import DataFilters, { IDataFilter } from "@src/Components/DataFilters";
import PropertiesGroupsSelector from "@src/Components/Forms/PropertiesGroups";
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import LoadingBox from "@src/Components/LoadingBox";
import ExpirationItem, { IExirationData } from "./Item";
import { StoreContext } from "@src/DataProvider";


const initialQueryParams: FieldValues = {
    group: null
};

const TContractExpirationLayout: FC = () => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const filterFormData = useForm({ defaultValues: initialQueryParams });
    const [expirationData, setExpirationData] = useState<IExirationData[]>([]);
    
    const loadExpirationData = (data?: FieldValues) => {
        console.log('FILTER-RESUME-DATA', data);
        
        fetchData.get('/properties/contracts/expiration.php', { account: user.id , ...data }, (response: TCallBack) => {
            const data = validateResult(response.result);
            setExpirationData(data);
        });
        
    };

    const buildDataFilters = (): IDataFilter[] => {
        return [
            {
                dataKey: 'group',
                gridItemProps: { size: { xs: 12, sm: 6 } },
                component: (field) => {
                    return <PropertiesGroupsSelector field={field} />
                }
            }
        ]
    };

    return (<>
        <Header title="VENCIMIENTOS" subTitle={`${user?.role?.label}: ${user.fullName}`}/>
        <DataFilters filters={buildDataFilters()} formData={filterFormData} loading={loading} onFilter={loadExpirationData} expanded={false} />
        {loading && <LoadingBox />}
        {!loading && (<TableContainer>
            <Table aria-label="collapsible table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Propiedad</TableCell>
                        <TableCell>Estado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expirationData.map((exp: IExirationData, ix: number) => {
                        return <ExpirationItem key={`ex${ix}`} expirationData={exp} />
                    })}
                </TableBody>
            </Table>
        </TableContainer>)}
    </>);
};

export default TContractExpirationLayout;