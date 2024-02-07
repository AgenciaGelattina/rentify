
/**
 * RANDOM UNIQUE ID V1.0
*/
type TGetUIKey = {
    removeHyphen?: boolean;
    toUpperCase?: boolean;
}

export const getUIKey = (config?: TGetUIKey): string => {
    let randomUUID = crypto.randomUUID();
    if (config?.removeHyphen) {
        randomUUID = randomUUID.replace(/[\W]/gm,'');
    }
    if (config?.toUpperCase) {
        randomUUID = randomUUID.toUpperCase();
    }
    return randomUUID;
}

/**
 * FORMAT MONEY
*/
export const formatToMoney = (number: number | bigint): string => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MEX' }).format(number);
}

/**
 * FORMAT MONEY
*/
export const capitalize = (str: string, allFirtsChars: boolean = false): string => {
    if (allFirtsChars) {
        return str.replace(/(^\w{1})|(\s+\w{1})/g, ch => ch.toUpperCase());
    }
    return str.replace(/(^\w{1})/, ch => ch.toUpperCase());
}