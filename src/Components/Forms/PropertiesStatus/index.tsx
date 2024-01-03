import { forwardRef, useMemo } from "react";
import { useFetchExpress } from '@phoxer/react-components';
import useDataResponse from "@src/Hooks/useDataResponse";
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';
import DummyTextField from "../DummyTextField";

export interface IPropertiesStatusSelector {
    id: number;
    label: string;
}

const PropertiesStatusSelector = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const status = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/statuses/list.php`);
    const { validateResult } = useDataResponse();

    const data = useMemo(() => {
        const statusData = validateResult(status.result);
        if (isNotNil(statusData)) {
            return statusData;
        }
        return null;
    }, [status.result]);

    if (data && !status.loading) {
        return (<TextField id="status" label="Estado de la Propiedad" {...props} disabled={isNil(status.result)} select fullWidth>
            {data.map((sts: IPropertiesStatusSelector) => <MenuItem key={getUIKey()} value={sts.id}>{sts.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField />;
});
PropertiesStatusSelector.displayName= 'PropertiesStatusSelector';
export default PropertiesStatusSelector;