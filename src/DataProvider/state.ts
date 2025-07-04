import { createTheme } from '@mui/material/styles';
import { IState, IReducer, IUser, IContractSummary } from './interfaces';
import { STATE_ACTIONS, ROUTES_ACTIONS } from '@src/Constants';
import { createRoutesItems } from './routes';
import { IListItem } from '@src/Components/Navigation/List/ListItem/ListItem';
import { isNotNil } from 'ramda';
import { IContract } from '@src/Components/Properties/Contracts/Details';
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
    routes: [],
    summary: {
        data: [],
        updated: 0
    },
    contractSummary: null
}

// Main State
export const mainStateReducer: IReducer = {
    [STATE_ACTIONS.SET_USER]: (state: IState, user: IUser) => {
        if (user.id > 0 && isNotNil(user.role)) {
            return { ...state, user, routes: createRoutesItems(user.role.id) };
        }
        return mainStateDefault;
    },
    [STATE_ACTIONS.LOGIN_OUT]: () => {
        return mainStateDefault;
    },
    [ROUTES_ACTIONS.UPDATE_ROUTE]: (state: IState, item: IListItem) => {
        return { ...state, routes: expandRouter(state.routes, item) };
    },
    [ROUTES_ACTIONS.ACTIVE_ROUTE]: (state: IState, path: string) => {
        return { ...state, routes: activeRouter(state.routes, path) };
    },
    [STATE_ACTIONS.SET_CONTRACT_SUMMARY]: (state: IState, { contract, property }: IContractSummary) => {
        return {
            ...state,
            contractSummary: {
                contract,
                property,
                updated: new Date().getTime()
            }
        }
       
    },
    [STATE_ACTIONS.REMOVE_CONTRACT_SUMMARY]: (state: IState) => {
        return {
            ...state,
            contractSummary: null
        }
    },
    [STATE_ACTIONS.SET_CONTRACTS_SUMMARY]: (state: IState, summaryData: IContractSummary[]) => {
        return { ...state, summary: {
            data: summaryData,
            updated: new Date().getTime()
        } };
    },
    [STATE_ACTIONS.UPDATE_CONTRACT_ON_SUMMARY]: (state: IState, newContract: IContract) => {
        const { summary } = state;
        const newSummaryData = summary.data.map((smm : IContractSummary) => {
            const { contract } = smm;
            if (isNotNil(contract) && (contract.id === newContract.id)) {
                return { ...smm, contract: newContract };
            };
            return smm;
        });
        return { ...state, summary: {
            data: newSummaryData,
            updated: new Date().getTime()
        }};
    }
};

// Theme

declare module '@mui/material/styles' {
  interface Palette {
    attencion: Palette['primary'];
  }

  interface PaletteOptions {
    attencion?: PaletteOptions['primary'];
  }
};

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    attencion: true;
  }
};

export const theme = createTheme({
    palette: {
        attencion: {
            main: '#ffea00',
            dark: '#ffea00',
            contrastText: '#FFF'
        },
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