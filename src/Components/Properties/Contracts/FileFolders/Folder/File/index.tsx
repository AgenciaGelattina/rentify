import { FC } from 'react';
import { Box, Divider, FormHelperText, IconButton, LinearProgress, ListItem, Typography } from '@mui/material';
import { IFileStatus, TUploadProgress } from '@src/Hooks/useFilesUpload';
import { Delete } from '@mui/icons-material';

type TFileStatus = {
    file: IFileStatus
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

const FileStatus: FC<TFileStatus> = ({ file }) => {
    const {id, name, type, uploadProgress, isUploading, error, errorMessage }= file;
    return (<ListItem sx={{ display: 'block' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box>
                <Typography>{`${file.name}.${file.type}`}</Typography>
                {errorMessage && <FormHelperText error={error} >{errorMessage}</FormHelperText>}
            </Box>
            
            <IconButton aria-label="delete">
                <Delete />
            </IconButton>
        </Box>
        {uploadProgress && <ProgressBar {...uploadProgress} />}
        <Divider />
    </ListItem>);
}

export default FileStatus;