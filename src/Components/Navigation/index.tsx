'use client';
import { useContext, useState } from "react";
import { StoreContext } from '@src/DataProvider';
import Box from "@mui/material/Box";
import TopBar from "@src/Components/Navigation/TopBar";
import SideBar from "@src/Components/Navigation/SideBar";

type TNavigation = {
    children: React.ReactNode;
}

const Navigation: React.FC<TNavigation> = ({ children }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    return (<>
        <TopBar user={user} setOpenMenu={setOpenMenu} /> 
        <Box sx={{ display: 'flex'}}>
            <SideBar open={openMenu} onClose={setOpenMenu} user={user} />
            <Box sx={{ marginTop: '48px', padding: '1rem', width: 'calc(100% - 48px)' }}>
                { children }
            </Box>
        </Box>
    </>)
}

export default Navigation;