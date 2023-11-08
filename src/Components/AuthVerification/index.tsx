import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { TRootLayout } from '../../app/layout';
import AuthUser from "./Auth";

const AuthVerification: React.FC<TRootLayout> = ({ children }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    return user.id > 0 ? children : <AuthUser />;
}

export default AuthVerification;