import { FormHelperText } from "@mui/material"
import { TFieldError } from "@src/Utils";
import { FC } from "react";

const ErrorHelperText: FC<TFieldError> = (fieldError) => {
    const { error, color, helperText } = fieldError;
    if (error) {
        return <FormHelperText error={error} color={color}>{helperText}</FormHelperText>;
    }
    return null;
}

export default ErrorHelperText;