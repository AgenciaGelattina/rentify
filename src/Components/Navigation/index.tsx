'use client';
import { FC, useContext, useState } from "react";
import { StoreContext } from '@src/DataProvider';
import Box from "@mui/material/Box";
import TopBar from "@src/Components/Navigation/TopBar";
import SideBar from "@src/Components/Navigation/SideBar";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import { SContent } from "./style";

type TNavigation = {
    children: React.ReactNode;
};

const Navigation: FC<TNavigation> = ({ children }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    return (<>
        <TopBar user={user} openMenu={openMenu} setOpenMenu={setOpenMenu} /> 
        <Box sx={{ display: { md: "flex" }, height: "100%" }}>
            <SideBar open={openMenu} setOpenMenu={setOpenMenu} user={user} />
            <SContent>
                { children }
            </SContent>
        </Box>
    </>)
}

export default Navigation;