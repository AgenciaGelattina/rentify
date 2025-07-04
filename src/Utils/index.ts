import { IUser } from '@src/DataProvider/interfaces';
import { isNotNil } from 'ramda';

export * from './forms';
export * from './strings';
export * from './dates';


// CheckUser Permision
export const showOnRoles = (user: IUser, roles: number[]): boolean => {
    if(user.id > 0 && isNotNil(user.role)) {
        return roles.includes(user.role.id);
    };
    return false;
}