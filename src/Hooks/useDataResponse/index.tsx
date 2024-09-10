import { useSnackMessages } from "@phoxer/react-components";
import { isEmpty, isNotNil } from "ramda";

type TDataResult = {
    success?: { data: any, message: string } | null;
    error?: { status: string, message: string } | null;
}

type TUseDataResponse = {
    validateResult: (result: TDataResult | null) => any;
}

const useDataResponse = (): TUseDataResponse => {
    const { showSnackMessage } = useSnackMessages();

    const validateResult = (result: TDataResult | null) => {
        if (isNotNil(result)) {
            if (isNotNil(result.success)) {
                const { data, message } = result.success;
                if (!isEmpty(message)) {
                    showSnackMessage({ severity: "success", message });
                }
                return isNotNil(data) ? data : null
            } else {
                if (isNotNil(result.error)) {
                    const { message } = result.error;
                    showSnackMessage({ severity: "error", message });
                } else {
                    showSnackMessage({ severity: "error", message: "Ha ocurrido un error en el proceso de datos." });
                }
                return null;
            }
        };
        return null;
    }

    return { validateResult };
};

export default useDataResponse;