import { FC, ReactNode, useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import { Alert } from "@mui/material";
import { showOnRoles } from "@src/Utils";

type TRoleVerification = {
    children: ReactNode;
    roles: number[];
};

const RoleVerification: FC<TRoleVerification> = ({ children, roles }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    
    return showOnRoles(user, roles) ? children : <Alert color="error">NOT AUTORIZED.</Alert>;
}

export default RoleVerification;