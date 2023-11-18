import { FieldError } from "react-hook-form";

type TFieldError = {
    error: boolean;
    color: 'error' | 'primary';
    helperText: string | undefined;
}

export const fieldError = (error: FieldError | undefined): TFieldError => {
    const hasError = error !== undefined;
    return {
        error: hasError,
        color: hasError? 'error' : 'primary',
        helperText: error?.message
    }
}