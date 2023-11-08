import { forwardRef } from "react";
import { useFetchExpress } from '@phoxer/react-components';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil } from 'ramda';
import { getUIKey } from '@src/Utils';

export interface IPropertiesStatusSelector {
    id: number;
    label: string;
}

const PropertiesStatusSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const status = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/status/list.php`);

    if (status.result && !status.loading) {
        return (<TextField id="status" label="Estado de la Propiedad" {...props} disabled={isNil(status.result)} select fullWidth>
            {status.result.map((sts: IPropertiesStatusSelector) => <MenuItem key={getUIKey()} value={sts.id}>{sts.label}</MenuItem>)}
        </TextField>);
    }
    return null;
});
PropertiesStatusSelector.displayName= 'PropertiesStatusSelector';
export default PropertiesStatusSelector;