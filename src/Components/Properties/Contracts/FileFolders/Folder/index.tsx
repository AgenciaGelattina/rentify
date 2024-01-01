import { FC, useEffect, useState } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Box, Divider, IconButton, List, Typography } from '@mui/material';
import { ConditionalRender, useFetchData } from '@phoxer/react-components';
import useFilesUpload, { IFileStatus } from '@src/Hooks/useFilesUpload';
import FileStatus from './File';
import { ExpandMore, Folder as FolderIcon, Edit, NoteAdd } from '@mui/icons-material';
import LoadingBox from '@src/Components/LoadingBox';
import useDataResponse from '@src/Hooks/useDataResponse';
import { isNil, isNotNil } from 'ramda';

export interface IFolder {
    name: string;
    title: string;
    description: string;
    num_files: number;
}

type TFolder = {
    folder: IFolder;
    onEditFolder?: (name: string) => void;
}

const Folder: FC<TFolder> = ({ folder, onEditFolder }) => {
    const { name, title, description, num_files = 0 } = folder;
    const [ totalFiles, setTotalFiles] = useState<number>(num_files);
    const filesApi = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [expanded, setExpanded] = useState<boolean>(false);
    const fileUpload = useFilesUpload({ 
        endPoint: `${process.env.NEXT_PUBLIC_API_URL!}/files/upload.php`,
        multiple: true,
        acceptedFilesType: ['pdf','pdfx','jpg','png','jpeg'],
        data: { folder: name }
    });

    const files = validateResult(filesApi.result);

    useEffect(() => {
        console.log(folder.name, expanded);
        if (expanded && isNil(files)) {
            filesApi.fetchData.get('/files/files.php', { folder: name });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, expanded, files]);

    return (<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ alignItems: 'center', margin: '0px' }}
          id={name}
        >
            <Box sx={{ flexGrow: 1, marginLeft: '.7rem ' }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1 }}><FolderIcon sx={{ width: 20, height: 20 }} /> {title}</Typography>
                <Typography variant="caption">{description}</Typography>
            </Box>
            <Avatar sx={{ width: 20, height: 20 }}>{totalFiles}</Avatar>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
            <ConditionalRender condition={filesApi.loading}>
                <LoadingBox />
            </ConditionalRender>
            <ConditionalRender condition={!filesApi.loading}>
                <List>
                    {files && files.map((file: IFileStatus) => {
                        return <FileStatus key={file.id} file={file} folder={folder} filesApi={filesApi} />
                    })}
                    {fileUpload.files.map((file: IFileStatus) => {
                        return <FileStatus key={file.id} file={file} folder={folder} filesApi={filesApi} />
                    })}
                </List>
            </ConditionalRender>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
            {onEditFolder && (<IconButton onClick={() => onEditFolder(name)}>
                <Edit />
            </IconButton>)}
            <IconButton onClick={fileUpload.selectFiles}>
                <NoteAdd />
            </IconButton>
        </AccordionActions>
    </Accordion>)
}

export default Folder;