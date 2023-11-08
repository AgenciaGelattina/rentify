import { forwardRef } from "react";
import { useFetchExpress } from '@phoxer/react-components';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil } from 'ramda';
import { getUIKey } from '@src/Utils';

export interface IRole {
    id: number;
    label: string;
}

const RolesSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const roles = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/accounts/roles.php`);

    if (roles.result && !roles.loading) {
        return (<TextField id="role" label="Permisos" {...props} disabled={isNil(roles.result)} select fullWidth>
            {roles.result.map((role: IRole) => <MenuItem key={getUIKey()} value={role.id}>{role.label}</MenuItem>)}
        </TextField>);
    }
    return null;
})

RolesSelector.displayName = 'RolesSelector';
export default RolesSelector;