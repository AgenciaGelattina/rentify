/** 2.0.2 | www.phoxer.com */
import { FC, useContext, useEffect, useReducer } from 'react';
import { StoreContext } from '@src/DataProvider';
import { useRouter, usePathname } from 'next/navigation';
import ListItem, { IListItem } from './ListItem/ListItem';
import { MenuList, MenuListProps } from '@mui/material';
import { isEmpty, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';
import { ROUTES_ACTIONS } from '@src/Constants';

type TListProps = {
    menuListProps?: MenuListProps;
    setOpenMenu: (open: boolean) => void;
}

/*
const formatListDataToListStatus = (listData: IListItem[]): IListItem[] => {
    return listData.map((data: IListItem) => {
        const newData: IListItem = { ...data, id: getUIKey() };
        if (isNotNil(data.listItems) && !isEmpty(data.listItems)) {
            newData.listItems = formatListDataToListStatus(data.listItems);
        }
        return newData;
    });
}*/

const List: FC<TListProps> = ({ menuListProps, setOpenMenu }) => {
    const { state: { routes }, setMainState } = useContext(StoreContext);
    const { push } = useRouter();
    const pathname = usePathname();

    const onListItemSelected = (item: IListItem) => {
        if (isNotNil(item.value)) {
            push(item.value);
            setOpenMenu(false);
        } else {
            setMainState(ROUTES_ACTIONS.UPDATE_ROUTE, item);
        }
    }
    
    useEffect(() => {
        setMainState(ROUTES_ACTIONS.ACTIVE_ROUTE, pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (<MenuList component="nav" dense disablePadding {...menuListProps} >
        {routes.map((listItem: IListItem) => {
            return <ListItem key={listItem.id || getUIKey()} listItem={listItem} onItemSelected={onListItemSelected} />;
        })}
    </MenuList>);
}

export default List;