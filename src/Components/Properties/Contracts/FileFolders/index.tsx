import { useEffect, useState, FC } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import { ConditionalRender, Header, TCallBack, useFetchData } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { CreateNewFolder } from '@mui/icons-material';
import FolderForm, { TFolderForm } from './FolderForm';
import LoadingBox from '@src/Components/LoadingBox';
import Folder, { IFolder } from './Folder';
import { getUIKey } from '@src/Utils';

type TContractFileFolders = {
    contract: { id: number };
    editMode: boolean;
}

const ContractFileFolders: FC<TContractFileFolders> = ({ contract, editMode }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [folderForm, setFolderForm] = useState<TFolderForm>({ name: "", contract_id: contract.id, open: false });
    const [folders, setFolders] = useState<IFolder[]>([]);

    const getFolders = ( ) => {
        const query = { contract_id: contract.id };
        fetchData.get('/properties/contracts/folders.php', query, (response: TCallBack) => {
            const folders = validateResult(response.result);
            if (folders) {
                setFolders(folders);
            }
        });
    }
    
    useEffect(() => {
        getFolders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<Box sx={{ border: '1px solid #ccc', backgroundColor: '#ebebeb', padding: '1rem' }}>
        <Header title="ARCHIVOS DEL CONTRATO" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            <ConditionalRender condition={editMode}>
                <IconButton onClick={() => setFolderForm({ name: "", contract_id: contract.id, open: true })}>
                    <CreateNewFolder fontSize="inherit" color='primary' />
                </IconButton>
            </ConditionalRender>
        </Header>
        {loading && <LoadingBox />}
        {folders && (<Stack>
            {folders.map((folder: IFolder) => <Folder key={getUIKey()} folder={folder} onEditFolder={(name: string) => setFolderForm({ name, contract_id: contract.id, open: true }) } />)}
        </Stack>)}
        <ConditionalRender condition={editMode}>
            <FolderForm {...folderForm} setOpen={setFolderForm} getFolders={getFolders} />
        </ConditionalRender>
    </Box>)
}

export default ContractFileFolders;