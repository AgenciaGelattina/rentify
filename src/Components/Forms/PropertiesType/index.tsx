import { forwardRef } from 'react';
import { useFetchExpress } from '@phoxer/react-components';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil } from 'ramda';
import { getUIKey } from '@src/Utils';

export interface IPropertiesTypeSelector {
    id: number;
    label: string;
}

const PropertiesTypeSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const types = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/types/list.php`);

    if (types.result && !types.loading) {
        return (<TextField id="type" label="Tipo de Propiedad" {...props} disabled={isNil(types.result)} select fullWidth>
            {types.result.map((type: IPropertiesTypeSelector) => <MenuItem key={getUIKey()} value={type.id}>{type.label}</MenuItem>)}
        </TextField>);
    }
    return null;
});

PropertiesTypeSelector.displayName = 'PropertiesTypeSelector';
export default PropertiesTypeSelector;