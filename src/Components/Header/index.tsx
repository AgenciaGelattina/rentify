/** 1.0.3 | www.phoxer.com */
import { styled } from '@mui/material/styles';
import AppBar, { AppBarOwnProps } from '@mui/material/AppBar';
import Toolbar, { ToolbarOwnProps } from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import { ConditionalRender } from '@phoxer/react-components';
import { isNotNil } from 'ramda';
import { FC } from 'react';

interface IHeader {
    title: string;
    icon?: JSX.Element;
    children?: React.ReactNode;
    appBarProps?: AppBarOwnProps;
    toolBarProps?: ToolbarOwnProps;
    typographyProps?: TypographyOwnProps;
}

const SAppBar = styled(AppBar)`
    box-shadow: unset;
    background-color: unset;
    color: #000;
    border-bottom: .1rem rgba(0, 0, 0, 0.12) solid;
    padding-bottom: 1rem;
    width: 100%
`
const SToolbar = styled(Toolbar)`
    padding: 0px 8px !important;
    width: 100%;
    min-height: 20px;
`
const STypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: bold;
    margin-left: 0.5rem;
    flex-grow: 1;
    line-height: 0rem;
`

const Header: FC<IHeader> = ({ title, icon, children, appBarProps, toolBarProps, typographyProps }) => {
    return (<SAppBar { ...{ position:"static", ...appBarProps } }>
        <SToolbar variant="dense" {...toolBarProps}>
            {icon && icon}
            <ConditionalRender condition={isNotNil(typographyProps)} showOnNoCondition={<STypography>{title}</STypography>}>
                <Typography {...typographyProps} sx={{ flexGrow: 1 }}>{title}</Typography>
            </ConditionalRender>
            {children && <Stack spacing={1} direction="row">{children}</Stack>}
        </SToolbar>
    </SAppBar>)
}

export default Header;
export type { IHeader };