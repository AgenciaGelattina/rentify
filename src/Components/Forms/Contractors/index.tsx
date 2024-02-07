import { forwardRef, memo, useMemo } from 'react';
import { useFetchExpress } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import { getUIKey } from '@src/Utils';
import DummyTextField from '../DummyTextField';

export interface IContractorsSelector {
    id: number;
    label: string;
}

type TContratortsSelector = {
    contract_id: number;
}

const ContractorsSelector = forwardRef<TextFieldProps, TContratortsSelector & ControllerRenderProps<FieldValues, string>>((props, ref) => {
    const contractorsApi = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/contracts/contractors/list.php?contract_id=${props.contract_id}`);
    const { validateResult } = useDataResponse();

    const options = useMemo(() => {
        const contractors = validateResult(contractorsApi.result);
        if (isNotNil(contractors)) {
            return contractors;
        }
        return [{ id: 0, label: "No asignar inquilino" }];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractorsApi.result]);

    if ((options.length > 0) && !contractorsApi.loading) {
        return (<TextField id="contractor" label="Inquilino" {...props} disabled={isNil(contractorsApi.result)} select fullWidth>
            {options.map((contractor: IContractorsSelector) => <MenuItem key={getUIKey()} value={contractor.id}>{contractor.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField label="Inquilino" helperText={options.length === 1 ? "No hay lista de inquilinos." : ""} error={true} />
});

ContractorsSelector.displayName = 'ContractorsSelector';
export default ContractorsSelector;