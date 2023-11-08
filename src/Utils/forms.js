export const fieldError = (error) => {
    const hasError = error !== undefined;
    return {
        error: hasError,
        helperText: error?.message
    }
}