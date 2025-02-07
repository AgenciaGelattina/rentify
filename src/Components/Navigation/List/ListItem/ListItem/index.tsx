/** 2.0.2 | www.phoxer.com */
import { FC, JSX } from 'react';
import MenuList from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { isNil, isNotNil } from 'ramda';

export interface IListItem {
    id?: string;
    label?: string;
    value?: any;
    icon?: JSX.Element;
    listItems?: IListItem[];
    expanded?: boolean;
    active?: boolean;
    visible?: boolean;
}

interface IListItemProps {
    listItem: IListItem;
    onItemSelected: (listItem: IListItem) => void;
}

type TExpandList = {
    open: boolean;
}

const ExpandList: FC<TExpandList> = ({ open }) => {
    return open ? <ExpandMore /> : <ChevronRight />
}

const ListItem: FC<IListItemProps> = ({ listItem, onItemSelected }) => {
    const { label, value = null, icon, listItems, expanded, active } = listItem;
    const isHeader = isNil(value) && isNotNil(listItems);
    const showLabel = !isNil(label) || !isNil(icon);
    const isExpanded = isNil(expanded) ? true : expanded;

    if (listItem.visible === false) {
        return null;
    }

    return (<MenuList component="div" dense disablePadding>
        {showLabel && (<ListItemButton onClick ={() => onItemSelected(listItem)} selected={active}>
            {icon && <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>}
            {label && <ListItemText primary={label} primaryTypographyProps={{ variant: isHeader ? 'h6' : 'subtitle1' }} />}
            {isHeader && <ExpandList open={isExpanded} />}
        </ListItemButton>)}
        {isHeader && <Divider />}
        {isNotNil(listItems) && (<Collapse in={isExpanded} timeout="auto">
            <MenuList component="div" dense disablePadding sx={{ paddingLeft: showLabel ? 2 : 0 }}>
                {listItems && listItems.map((listItem: IListItem, index: number) => {
                    return <ListItem key={`itm${index}`} listItem={listItem} onItemSelected={onItemSelected} />
                })}
            </MenuList>
            <Divider />
        </Collapse>)}
    </MenuList>);
}

export default ListItem;