import { forwardRef } from "react";
import { TextField, TextFieldProps } from '@mui/material';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { NumericFormat } from "react-number-format";


const NumericFormatCustom = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>(
    function NumericFormatCustom(props, ref) {
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
    },
  );

const TextFieldMoney = forwardRef<TextFieldProps, ControllerRenderProps<FieldValues, string>>((field, ref) => {

    return (<TextField
        label= "Renta Mensual"
        {...field}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
        }}
        fullWidth
    />);
});
TextFieldMoney.displayName= 'TextFieldMoney';
export default TextFieldMoney;