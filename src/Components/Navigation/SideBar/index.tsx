import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { SDrawer } from './style';
import List from '../List';
import { IUser } from '@src/DataProvider/interfaces';
 
type TSideBar = {
    open: boolean;
    user: IUser;
    onClose: (open: boolean) => void;
}
/*
const menuTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                root: {
                    flexShrink: 0,
                    height: '100%'
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    top: 48,
                    height: '100%'
                },
            },
        }
    }
});
*/
const SideBar: React.FC<TSideBar> = ({ open, onClose, user }) => {
    const isDesktop = useMediaQuery('(min-width:600px)');
    const menuWidth = 250;

    return (<Box component="nav" sx={{ width: menuWidth , flexShrink: { sm: 0 }, display: { xs: 'none', sm: 'block' } }}>
        <SDrawer
            variant={isDesktop? "persistent" : "temporary"}
            open={isDesktop? true : open}
            onClose={() => onClose(false)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    width: menuWidth
                }
            }}
        >
            <List />
        </SDrawer>
    </Box>)
}

export default SideBar;