import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Box, Button, DialogActions, Divider, FormHelperText, IconButton, LinearProgress, ListItem, Stack, Typography } from '@mui/material';
import { IFileStatus, TUploadProgress } from '@src/Hooks/useFilesUpload';
import { Delete, FileDownload, Cancel } from '@mui/icons-material';
import { ConditionalRender, IMessageDialog, MessageDialog } from '@phoxer/react-components';
import { isNotNil } from 'ramda';
import { IFolder } from '..';

type TFileStatus = {
  file: IFileStatus;
  folder: IFolder; 
  filesApi: any;
}

const ProgressBar: FC<TUploadProgress> = ({ total, loaded, percent }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percent} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${percent}%`}</Typography>
          </Box>
        </Box>
      );
}

const messageDialogInit: IMessageDialog = { show: false, message: "", supportHTML: true, severity: "warning" };

const FileStatus: FC<TFileStatus> = ({ file, filesApi, folder }) => {
    const { id, name, type, uploadProgress, isUploading, error, errorMessage, xhr } = file;
    const [ deleteDialog, setDeleteDialog ] = useState<IMessageDialog>(messageDialogInit);

    const promptToDelete = () => {
      setDeleteDialog((prev: IMessageDialog) => {
        return {
          ...prev,
          show: true,
          message: `Se va a eliminar el archivo <b>${file.name}</b> del sistema.<br>El archivo <b>No podrá recuperarse</b> ¿Seguro desea continuar?`
        }
      })
    }

    const deleteFile = (del: boolean) => {
      if (del) {
        filesApi.fetchData.post('/files/delete.php', { file_id: file.id, file_type: file.type, folder: folder.name });
      }
      setDeleteDialog(messageDialogInit);
    }

    const downloadFile = () => {
      window.location.assign(`${process.env.NEXT_PUBLIC_API_URL!}/files/download.php?file=${file.id}`);
    }

    return (<ListItem sx={{ display: 'block' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography>{`${name}.${type}`}</Typography>
                {id && <FormHelperText>#{id}</FormHelperText>}
                {errorMessage && <FormHelperText error={error} >{errorMessage}</FormHelperText>}
            </Box>
            <Stack direction="row" alignItems="center" spacing={0}>
              <ConditionalRender condition={!isUploading && !error}>
                <IconButton aria-label="download" color='primary' onClick={downloadFile}>
                    <FileDownload />
                </IconButton>
                <IconButton aria-label="delete" onClick={promptToDelete}>
                    <Delete />
                </IconButton>
              </ConditionalRender>
              <ConditionalRender condition={isUploading || error}>
                <IconButton aria-label="cancel" color='error'>
                    <Cancel />
                </IconButton>
              </ConditionalRender>
            </Stack>
        </Box>
        <ConditionalRender condition={isUploading}>
            {uploadProgress && <ProgressBar {...uploadProgress} />}
        </ConditionalRender>
        <Divider />
        <MessageDialog {...deleteDialog}>
          <DialogActions>
            <Button onClick={() => deleteFile(false)} autoFocus>CERRAR</Button>
            <Button onClick={() => deleteFile(true)}>BORRAR</Button>
          </DialogActions>
        </MessageDialog>
    </ListItem>);
}

export default FileStatus;