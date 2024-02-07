'use client';
import { createContext, useReducer, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TDataProviders, IState, TStateContext, IReducerAction } from './interfaces';
import { mainStateDefault, theme, mainStateReducer } from './state';

export const StoreContext = createContext<TStateContext>({ state: mainStateDefault, setMainState: () => {} });

const storeReducer = (state: IState, action: IReducerAction) => {
  return mainStateReducer[action.type](state, action.data);
};

const DataProviders: React.FC<TDataProviders> = ({ children }) => {
  const [state, dispatchState] = useReducer(storeReducer, mainStateDefault);

  const setMainState = (action: string, data: any) => {
    console.log('setMainState', data)
    dispatchState({ type: action, data });
  };
  
  const memoizedTheme = useMemo(()=>{
    return createTheme({
      ...theme
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<ThemeProvider theme={memoizedTheme}>
    <StoreContext.Provider value={{ state, setMainState }}>
        {children}
    </StoreContext.Provider>
  </ThemeProvider>);
};

export default DataProviders;
