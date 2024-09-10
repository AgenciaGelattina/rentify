import { createTheme } from '@mui/material/styles';
import { IState, IReducer, IUser } from './interfaces';
import { STATE_ACTIONS, ROUTES_ACTIONS } from '@src/Constants';
import { createRoutesItems } from './routes';
import { IListItem } from '@src/Components/Navigation/List/ListItem/ListItem';
import { isNotNil } from 'ramda';

// route
const expandRouter = (listItems: IListItem[], item: IListItem): IListItem[] => {
    const routes = listItems.map((itm: IListItem) => {
            if (isNotNil(itm.expanded) && (itm.id === item.id)) {
                itm.expanded = !itm.expanded;
            };
            if (itm.listItems) {
                itm.listItems = expandRouter(itm.listItems, item);
            }
            return itm;
    });
    return routes;
}

const activeRouter = (listItems: IListItem[], path: string): IListItem[] => {
    const routes = listItems.map((itm: IListItem) => {
            itm.active = false;
            if (isNotNil(itm.value)) {
                itm.active = itm.value === path;
            };
            if (itm.listItems) {
                itm.listItems = activeRouter(itm.listItems, path);
            }
            return itm;
    });
    return routes;
}

export const mainStateDefault: IState = {
    user: {
        id: 0,
        token: null
    },
    routes: []
}

// Main State
export const mainStateReducer: IReducer = {
    [STATE_ACTIONS.SET_USER]: (state: IState, user: IUser) => {
        return { ...state, user, routes: createRoutesItems(user.role || 0) };
    },
    [STATE_ACTIONS.LOGIN_OUT]: () => {
        return mainStateDefault;
    },
    [ROUTES_ACTIONS.UPDATE_ROUTE]: (state: IState, item: IListItem) => {
        return { ...state, routes: expandRouter(state.routes, item) };
    },
    [ROUTES_ACTIONS.ACTIVE_ROUTE]: (state: IState, path: string) => {
        return { ...state, routes: activeRouter(state.routes, path) };
    }
};

// Theme
export const theme = createTheme({
    palette: {
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small"
            },
            styleOverrides: {
                root:{
                    marginBottom: '1rem'
                }
            }
        },
        MuiButton: {
            defaultProps: {
                variant: "contained",
                size: "small"
            }
        },
        MuiIconButton: {
            defaultProps: {
                size: "small"
            }
        },
        MuiAccordionSummary: {
            styleOverrides: {
                content: {
                    margin: '.5rem 0rem',
                    alignItems: 'center',
                    "&.Mui-expanded": {
                        "margin": ".5rem 0rem"
                    }
                }
            }
        }
    },
});