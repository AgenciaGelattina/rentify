import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { Alert } from "@mui/material";

type TRoleVerification = {
    children: React.ReactNode;
    role: number;
}

const RoleVerification: React.FC<TRoleVerification> = ({ children, role }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    return (user.role && user.role <= role) ? children : <Alert color="error">NOT AUTORIZED.</Alert>;
}

export default RoleVerification;