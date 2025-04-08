'use client';
import { createContext, useReducer, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IDataProviders, IState, IStateContext, IStoreReducerData } from './interfaces';
import { mainStateDefault, theme, mainStateReducer } from './state';

export const StoreContext = createContext<IStateContext>({ state: mainStateDefault, setMainState: () => {} });

const storeReducer = (state: IState, reducerData: IStoreReducerData) => {
  return mainStateReducer[reducerData.action](state, reducerData.data);
};

const DataProviders: React.FC<IDataProviders> = ({ children }) => {
  const [state, dispatchState] = useReducer(storeReducer, mainStateDefault);

  const setMainState = (action: string, data?: any) => {
    dispatchState({ action, data });
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
