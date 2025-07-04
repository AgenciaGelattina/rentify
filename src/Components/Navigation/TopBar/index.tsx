
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Menu, Close } from '@mui/icons-material';
import Box from '@mui/material/Box';
import User from './User';
import { SAppBar, SToolBar } from './style';
import { IUser } from '@src/DataProvider/interfaces';

type TTopBar = {
    user: IUser;
    openMenu: boolean;
    setOpenMenu: (open: boolean) => void;
}

const TopBar: React.FC<TTopBar> = ({ user, openMenu, setOpenMenu }) => {

    return (<SAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <SToolBar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { sm: 'block', md: 'none' } }} onClick={()=> setOpenMenu(!openMenu)} >
                {openMenu ? <Close /> : <Menu />}
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                Rentify
            </Typography>
            <Box>
                <User user={user} />
            </Box>
        </SToolBar>
    </SAppBar>)
}

export default TopBar;