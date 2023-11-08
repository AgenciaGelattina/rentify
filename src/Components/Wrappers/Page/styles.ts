'use client';
import { styled } from '@mui/material/styles';

type TSContainer = {
    centerContent: Boolean;
    padding: string;
}

export const SContainer = styled('div')<TSContainer>(({ centerContent, padding }) => ({
    width: '100%',
    height: '100%',
    display: centerContent? 'flex' : 'block',
    justifyContent: centerContent? 'center' : 'unset',
    alignItems: centerContent?  'center' : 'unset',
    padding: padding
}));