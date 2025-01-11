import { FC, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { TCallBack, useFetchData, useFetchExpress } from '@phoxer/react-components';
import useDataResponse from '@src/Hooks/useDataResponse';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues, UseFormSetValue } from 'react-hook-form';
import { isNil, isNotNil } from 'ramda';
import DummyTextField from '../../DummyTextField';

export interface IExpressCharges {
    id: number;
    label: string;
}

interface IExpressChargesSelectorProps extends ControllerRenderProps<FieldValues, string> {
    contract: number;
    setValue: (value: number) => void; 
}

//const ExpressChargesSelector = forwardRef<TextFieldProps, IExpressChargesSelectorProps & ControllerRenderProps<FieldValues, string>>((props, ref) => {
const ExpressChargesSelector: FC<IExpressChargesSelectorProps> = (props) => {    
    const { contract, setValue, value } = props;
    const { fetchData, result, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [expressData, setExpressData] = useState<IExpressCharges[]>([]);

    useEffect(() => {
        //setExpressData([]);
        fetchData.get('/properties/contracts/charges/express/list.php', { contract }, (response: TCallBack) => {
            const expressData = validateResult(response.result);
            if (isNotNil(expressData)) {
                if (value === 0) {
                    setValue(expressData[0].id);
                }
                setExpressData(expressData);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!loading && value > 0 && expressData.length > 0) {
        return (<TextField id="express" label="Cargo a Pagar" {...props} disabled={isNil(result)} select fullWidth>
            {expressData.map((rp: IExpressCharges) => <MenuItem key={`rp${rp.id}`} value={rp.id}>{rp.label}</MenuItem>)}
        </TextField>);
    }
    return <DummyTextField />;
};

ExpressChargesSelector.displayName = 'ExpressChargesSelector';
export default ExpressChargesSelector;