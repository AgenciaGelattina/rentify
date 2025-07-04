'use client';
import { useState, useContext } from 'react';
import { StoreContext } from '@src/DataProvider';
import { useRouter } from 'next/navigation'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IUser } from '@src/DataProvider/interfaces';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { STATE_ACTIONS } from '@src/Constants';
import useSessionStorage from '@src/Hooks/useSessionStorage';

type TUser = {
    user: IUser;
}

const User: React.FC<TUser> = ({ user }) => {
    const { setMainState } = useContext(StoreContext);
    const sessionStorage = useSessionStorage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const open = Boolean(anchorEl);

    const closeMenu = () => {
        setAnchorEl(null);
    }

    const goTo = (route: string) => {
        router.push(route);
        closeMenu();
    }

    const logOut = () => {
        sessionStorage?.removeItem('token');
        setMainState(STATE_ACTIONS.LOGIN_OUT);
        closeMenu();
    }

    return (<>
        <Tooltip title="Account Settings">
                <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>{user.names?.charAt(0)}</Avatar>
                </IconButton>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeMenu}
            onClick={closeMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => goTo('/accounts/account')}>
                <ListItemIcon>
                    <PersonIcon fontSize="small" />
                </ListItemIcon>
                Mi Cuenta
            </MenuItem>
            <Divider />
            <MenuItem onClick={logOut}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    </>)
}

export default User;