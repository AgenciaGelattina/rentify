import { FC } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const DummyTextField: FC<TextFieldProps> = (textFieldProps) => {
    return <TextField placeholder='loading....' slotProps={{ input:{ readOnly: true } }} fullWidth {...textFieldProps} />;
}

export default DummyTextField;