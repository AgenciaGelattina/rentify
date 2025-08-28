import { FC, useMemo } from "react";
import { useFetchExpress } from '@phoxer/react-components';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';
import DummyTextField from "../DummyTextField";
import { IRole } from "@src/DataProvider/interfaces";
import useDataResponse from "@src/Hooks/useDataResponse";

export interface IAccount {
    id: number;
    names: string;
    surnames: string;
    role: IRole;
}

interface IAccountSelectorProps {
    value: number;
}

const AccountSelector: FC<IAccountSelectorProps> = (props) => {
    const accounts = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/accounts/list.php`);
    const { validateResult } = useDataResponse();

    const options = useMemo(() => {
        const accountsData = validateResult(accounts.result);
        if (isNotNil(accountsData)) {
            return accountsData;
        }
        return [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts.result]);

    if (options && !accounts.loading) {
        return (<TextField id="account" label="Cuentas" sx={{marginTop: '.5rem'}} {...props} disabled={isNil(accounts.result)} select fullWidth>
            <MenuItem value={0}>Sin Asignación</MenuItem>
            {options.map((account: IAccount, ix: number) => <MenuItem key={`ac${ix}`} value={account.id}>
                {`${account.role.label}: ${account.names} ${account.surnames}`}
            </MenuItem>)}
        </TextField>);
    };
    return <DummyTextField label="Cargando.." />;
};

AccountSelector.displayName = 'AccountSelector';
export default AccountSelector;