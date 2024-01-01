import { IListItem } from '@src/Components/Navigation/List/ListItem/ListItem';

export type TDataProviders = {
    children: JSX.Element;
}

export type IReducer = {
    [key: string]: (state: IState, data?: any) => IState;
}

export interface IReducerAction {
    type: string;
    data: any;
}

export interface IState {
    user: IUser;
    routes: IListItem[]
}

export type TStateContext = {
    state: IState,
    setMainState: (action: string, data?: any) => void;
}

export interface IUser {
    id: number;
    token: string | null;
    name?: string;
    email?: string;
    role?: number;
}