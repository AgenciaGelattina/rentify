import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

export const SDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
        background: 'var(--sidebar-background)',
        color: 'var(--sidebar-textcolor)',
        top: 48,
        '& .MuiListItemIcon-root': {
            color: 'var(--sidebar-textcolor)',
        }
    },
}));