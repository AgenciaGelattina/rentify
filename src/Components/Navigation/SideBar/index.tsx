import { createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { SDrawer } from './style';
import List from '../List';
import { IUser } from '@src/DataProvider/interfaces';
 
type TSideBar = {
    open: boolean;
    user: IUser;
    setOpenMenu: (open: boolean) => void;
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
const SideBar: React.FC<TSideBar> = ({ open, setOpenMenu, user }) => {
    const isDesktop = useMediaQuery('(min-width: 900px)');
    const menuWidth = 250;

    return (<Box component="nav" sx={{ width: menuWidth, minWidth: menuWidth, display: { xs: "none", md: "block" }}}>
        <SDrawer
            variant={isDesktop? "persistent" : "temporary"}
            open={isDesktop? true : open}
            onClose={() => setOpenMenu(false)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    width: menuWidth
                }
            }}
        >
            <List setOpenMenu={setOpenMenu} />
        </SDrawer>
    </Box>)
}

export default SideBar;