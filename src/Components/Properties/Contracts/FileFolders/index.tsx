import { useEffect, useState } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import { Header, useFetchData } from '@phoxer/react-components';
import { CreateNewFolder } from '@mui/icons-material';
import FolderForm, { TFolderForm } from './FolderForm';
import { TContractDetails } from '../Details';
import LoadingBox from '@src/Components/LoadingBox';
import Folder, { IFolder } from './Folder';
import { getUIKey } from '@src/Utils';

type TContractFileFolders = {
    contract: TContractDetails;
}

const ContractFileFolders: React.FC<TContractFileFolders> = ({ contract }) => {
    const { fetchData, loading, result, error } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [folderForm, setFolderForm] = useState<TFolderForm>({ name: "", contract_id: contract.id, open: false });

    const getFolders = ( ) => {
        const query = { contract_id: contract.id };
        fetchData.get('/properties/contracts/folders.php', query);
    }
    
    useEffect(() => {
        getFolders();
    }, []);

    console.log('RESULT----', result)

    return (<Box sx={{ border: '1px solid #ccc', backgroundColor: '#ebebeb', padding: '1rem' }}>
        <Header title="ARCHIVOS DEL CONTRATO" typographyProps={{ variant: "h6" }} toolBarProps={{ style: { minHeight: 25 } }}>
            <IconButton onClick={() => setFolderForm({ name: "", contract_id: contract.id, open: true })}>
                <CreateNewFolder fontSize="inherit" color='primary' />
            </IconButton>
        </Header>
        {loading && <LoadingBox />}
        {result && (<Stack>
            {result.map((folder: IFolder) => <Folder key={getUIKey()} folder={folder} onEditFolder={(name: string) => setFolderForm({ name, contract_id: contract.id, open: true }) } />)}
        </Stack>)}
        <FolderForm {...folderForm} setOpen={setFolderForm} getFolders={getFolders} />
    </Box>)
}

export default ContractFileFolders;