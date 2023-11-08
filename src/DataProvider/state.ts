import { createTheme } from '@mui/material/styles';
import { IState, IReducer, IUser } from './interfaces';
import { STATE_ACTIONS } from '@src/Constants';

// Main State
export const mainStateReducer: IReducer = {
    [STATE_ACTIONS.SET_USER]: (state: IState, user: IUser) => {
        return { ...state, user };
    },
    [STATE_ACTIONS.LOGIN_OUT]: (state: IState, user: IUser) => {
        return { ...state, user };
    }
};

export const mainStateDefault: IState = {
    user: {
        id: 0
    }
}

// Theme
export const theme = createTheme({
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
          },
    },
});