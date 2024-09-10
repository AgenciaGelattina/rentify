//** 1.0.1 | www.phoxer.com */
import { TableRow as Row, TableCell } from "@mui/material";
import { IDataTableColumn } from '../index';
import { isNotNil } from "ramda";
import { getUIKey } from "@src/Utils";

type TTableRow = {
    columns: IDataTableColumn[];
    data: any;
}

const TableRow: React.FC<TTableRow> = ({ columns, data }) => {
    return (<Row>
        {columns.map(({ dataKey, head, cell, component }: IDataTableColumn) => {
            return (<TableCell
                key={getUIKey()}
                align={cell?.align}
                padding={cell?.padding}
                width={head.width}
            >
                {isNotNil(dataKey) ? component(data[dataKey], data) : component(data)}
            </TableCell>);
        })}
    </Row>)
}

export default TableRow;