//** 1.0.1 | www.phoxer.com */
import { TableHead as Head, TableRow, TableCell } from "@mui/material";
import { TDataTableColumn } from '../index';
import { getUIKey } from "@src/Utils";

type TTableHead = {
    columns: TDataTableColumn[];
}

const TableHead: React.FC<TTableHead> = ({ columns }) => {
    return (<Head>
        <TableRow>
            {columns.map(({ head }: TDataTableColumn) => {
                const { label, align, padding, width } = head;
                return (<TableCell
                    key={getUIKey()}
                    align={align}
                    padding={padding}
                    sortDirection="desc"
                    width={width}
                >
                    {label}
                </TableCell>);
            })}
        </TableRow>
    </Head>)
}

export default TableHead;