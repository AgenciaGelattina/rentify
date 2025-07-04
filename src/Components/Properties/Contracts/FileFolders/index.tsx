import { useEffect, useState, FC, useContext } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { CreateNewFolder } from '@mui/icons-material';
import FolderForm, { TFolderForm } from './FolderForm';
import LoadingBox from '@src/Components/LoadingBox';
import Folder, { IFolder } from './Folder';
import { getUIKey } from '@src/Utils';
import { StoreContext } from '@src/DataProvider';
import Header from '@src/Components/Header';

type TContractFileFolders = {
    contract: { id: number };
}

const ContractFileFolders: FC<TContractFileFolders> = ({ contract }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [folderForm, setFolderForm] = useState<TFolderForm>({ name: "", contract_id: contract.id, open: false });
    const [folders, setFolders] = useState<IFolder[]>([]);

    const canEdit = user.role && (user.role.id < 3);

    const getFolders = ( ) => {
        const query = { contract_id: contract.id };
        fetchData.get('/properties/contracts/folders.php', query, (response: TCallBack) => {
            const folders = validateResult(response.result);
            if (folders) {
                setFolders(folders);
            }
        });
    };
    
    useEffect(() => {
        getFolders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<Box sx={{ border: '1px solid #ccc', backgroundColor: '#ebebeb', padding: '1rem' }}>
        <Header title="ARCHIVOS DEL CONTRATO" titleProps={{ variant: "subtitle2" }}>
            {canEdit && (<IconButton onClick={() => setFolderForm({ name: "", contract_id: contract.id, open: true })}>
                    <CreateNewFolder fontSize="inherit" color='primary' />
            </IconButton>)}
        </Header>
        {loading && <LoadingBox />}
        {folders && (<Stack>
            {folders.map((folder: IFolder) => <Folder key={getUIKey()} folder={folder} onEditFolder={(name: string) => setFolderForm({ name, contract_id: contract.id, open: true }) } />)}
        </Stack>)}
        {canEdit && <FolderForm {...folderForm} setOpen={setFolderForm} getFolders={getFolders} />}
    </Box>)
}

export default ContractFileFolders;