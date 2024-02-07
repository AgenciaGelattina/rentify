import { forwardRef, memo, useMemo } from 'react';
import { useFetchExpress } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';
import DummyTextField from '../DummyTextField';

export interface IGroupsTypeSelector {
    id: number;
    label: string;
}

const GroupsTypeSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const types = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/groups/types/list.php`);
    const { validateResult } = useDataResponse();

    const data = useMemo(() => {
        const typesData = validateResult(types.result);
        if (isNotNil(typesData)) {
            return typesData;
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [types.result]);

    if (data && !types.loading) {
        return (<TextField id="type" label="Tipo de Grupo" {...props} disabled={isNil(types.result)} select fullWidth>
            {data.map((type: IGroupsTypeSelector) => <MenuItem key={getUIKey()} value={type.id}>{type.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField label="Tipo de Grupo" />
});

GroupsTypeSelector.displayName = 'GroupsTypeSelector';
export default GroupsTypeSelector;