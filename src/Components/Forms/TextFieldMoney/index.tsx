import { forwardRef } from "react";
import { TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { NumericFormat } from "react-number-format";

type TTextFieldMoney = {
    label: string;
}

const NumericFormatCustom = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>(
    (props, ref) => {
        const { onChange, ...other } = props;
    
        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="$"
            />
        );
    }
);
NumericFormatCustom.displayName= 'NumericFormatCustom';

const TextFieldMoney = forwardRef<TextFieldProps, TTextFieldMoney & ControllerRenderProps<FieldValues, string>>((field, ref) => {

    return (<TextField
        {...field}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
        }}
        fullWidth
    />);
});
TextFieldMoney.displayName= 'TextFieldMoney';
export default TextFieldMoney;