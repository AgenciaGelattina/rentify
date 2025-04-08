'use client';
import { useContext, useEffect } from "react";
import { StoreContext } from '@src/DataProvider';
import AuthUser from "./Auth";
import { IPageLayout } from "@src/Constants";

const AuthVerification: React.FC<IPageLayout> = ({ children }) => {
    const { state } = useContext(StoreContext);
    const { user } = state;
    return user.id > 0 ? children : <AuthUser />;
}

export default AuthVerification;