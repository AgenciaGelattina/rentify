/** 1.0.3 | www.phoxer.com */
import { FC, JSX } from 'react';
import { styled } from '@mui/material/styles';
import AppBar, { AppBarOwnProps } from '@mui/material/AppBar';
import Toolbar, { ToolbarOwnProps } from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import { Box } from '@mui/material';

interface IHeader {
    title: string;
    subTitle?: string;
    icon?: JSX.Element;
    children?: React.ReactNode;
    appBarProps?: AppBarOwnProps;
    toolBarProps?: ToolbarOwnProps;
    titleProps?: TypographyOwnProps;
    subTitleProps?: TypographyOwnProps;
}

const SAppBar = styled(AppBar)`
    box-shadow: unset;
    background-color: unset;
    color: #000;
    border-bottom: .1rem rgba(0, 0, 0, 0.12) solid;
    padding-bottom: 1rem;
`
const SToolbar = styled(Toolbar)`
    padding: 0px 8px !important;
    min-height: 20px;
`
const STitle = styled(Typography)`
    font-weight: bold;
    margin-left: 0.5rem;
    line-height: 1rem;
`
const SSubTitle = styled(Typography)`
    margin-left: 0.5rem;
`

const Header: FC<IHeader> = ({ title, subTitle, icon, children, appBarProps, toolBarProps, titleProps, subTitleProps }) => {
    return (<SAppBar { ...{ position:"static", ...appBarProps } }>
        <SToolbar variant="dense" {...toolBarProps}>
            {icon && icon} 
            <Box sx={{ flexGrow: 1 }}>
                <STitle variant="h6" {...titleProps} >{title}</STitle>
                {subTitle && <SSubTitle variant="body2" {...subTitleProps} >{subTitle}</SSubTitle>}
            </Box>
            {children && <Stack spacing={1} direction="row">{children}</Stack>}
        </SToolbar>
    </SAppBar>)
}

export default Header;
export type { IHeader };