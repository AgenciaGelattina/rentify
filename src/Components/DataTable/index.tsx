//** 1.0.1 | www.phoxer.com */
import { TableContainer, Table, TableBody } from "@mui/material";
import TableHead from './Header';
import Rows from './Rows';
import TableLoading from './Loading';
import ConditionalAlert from "../ConditionalAlert";
import { isEmpty, isNotNil } from "ramda";

interface IDataTableCell {
    align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
    padding?: 'checkbox' | 'none' | 'normal';
    width?: number | string;
}

interface IDataTableHead {
    label: string;
}

export interface IDataTableColumn {
    dataKey?: string;
    head: IDataTableCell & IDataTableHead;
    cell?: IDataTableCell;
    component: (dataValue?: any, data?: any) => React.ReactNode;
}

interface IDataTable {
    columns: IDataTableColumn[];
    data: any[];
    loading: boolean;
    minHeight?: string | number;
    showBorders?: boolean;
    size?: 'small' | 'medium';
}

const DataTable: React.FC<IDataTable> = ({ columns, loading, data = [], minHeight, size='small' }) => {
    return (<>
        <TableContainer>
            <Table size={size}>
                <TableHead columns={columns} />
                <TableBody sx={{minHeight}}>
                    {loading && <TableLoading colSpan={columns ? columns.length : 1000} />}
                    {!loading && isNotNil(data) && data.map((dt: any, index: number) => {
                        return <Rows key={`row-${index}`} columns={columns} data={dt} />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <ConditionalAlert condition={!loading && isEmpty(data)} severity="warning" title="No se encontraron registros." />
    </>)
}

export default DataTable;