import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

export const SLogBox = styled(Card)(({ theme }) => ({
    minWidth: '400px',
    padding: '1rem',
    [theme.breakpoints.down('sm')]: {
        minWidth: 'unset',
        width: '100%',
        boxShadow: 'unset'
    },
}));

export const SLogo = styled('div')(() => ({
    textAlign: 'center',
    '& img': {
        width: '94px'
    }
}));