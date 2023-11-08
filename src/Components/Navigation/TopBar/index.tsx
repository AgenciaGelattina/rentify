
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import User from './User';
import { SAppBar, SToolBar } from './style';
import { IUser } from '@src/DataProvider/interfaces';

type TTopBar = {
    user: IUser;
    setOpenMenu: (open: boolean) => void;
}

const TopBar: React.FC<TTopBar> = ({ user, setOpenMenu }) => {

    return (<SAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <SToolBar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }} onClick={()=> setOpenMenu(true)} >
                <MenuIcon />
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