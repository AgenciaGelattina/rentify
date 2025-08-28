'use client';
import { useContext } from 'react';
import UserData from './UserData';
import UserPassword from '@src/Components/Accounts/Form/Password';
import { StoreContext } from '@src/DataProvider';


const Account: React.FC = () => {
    const { state } = useContext(StoreContext);
    return (<>
        <UserData user={state.user} />
        <UserPassword />
    </>);
}

export default Account;