//** 1.0.1 | www.phoxer.com */
import { TableCell, TableRow, CircularProgress } from "@mui/material";

type TTableLoading = {
    colSpan: number;
}

const TableLoading: React.FC<TTableLoading> = ({ colSpan }) => {
    return (<TableRow>
        <TableCell align='center' colSpan={colSpan} sx={{ height: 150 }}>
            <CircularProgress />
        </TableCell>
    </TableRow>)
};

export default TableLoading;