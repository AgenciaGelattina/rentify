import { IListItem } from '@src/Components/Navigation/List/ListItem/ListItem';
import { IContract } from '@src/Components/Properties/Contracts/Details';
import { IProperty } from '@src/Components/Properties/Details';
import { JSX } from 'react';

export interface IDataProviders {
    children: JSX.Element;
}

export interface IReducer {
    [key: string]: (state: IState, data?: any) => IState;
}

export interface IStoreReducerData {
    action: string;
    data?: any;
};

export interface IContractSummary {
    contract: IContract;
    property: IProperty;
    updated: number;
};

export interface IContractsSummary {
    data: IContractSummary[],
    updated: number; 
}

export interface IState {
    user: IUser;
    routes: IListItem[],
    summary: IContractsSummary,
    contractSummary: IContractSummary | null
}

export interface IStateContext {
    state: IState,
    setMainState: (action: string, data?: any) => void;
}

export interface IUser {
    id: number;
    token: string | null;
    name?: string;
    email?: string;
    role: number;
}