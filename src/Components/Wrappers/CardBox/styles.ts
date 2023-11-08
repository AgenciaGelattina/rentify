'use client';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const SCardBox = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: '0rem',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        boxShadow: 'unset',
        '& .MuiCardContent-root': {
            padding: 0
        }
    },
}));