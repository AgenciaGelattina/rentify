import { CURRENCY } from "@src/Constants";

/**
 * RANDOM UNIQUE ID V1.0
*/
interface IGetUIKey {
    removeHyphen?: boolean;
    toUpperCase?: boolean;
}

export const getUIKey = (config?: IGetUIKey): string => {
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
 * MAP KEYS GENERATOR 
*/
export const mapKey = (ui: string, ix: number): string => {
    return `${ui}.${ix}`;
}

/**
 * FORMAT MONEY
*/
export const formatToMoney = (number: number | bigint, currency: string = "mxs"): string => {
    const currencyData = new Intl.NumberFormat(CURRENCY[currency].local, { style: 'currency', currency: CURRENCY[currency].code }).format(number);
    return `${CURRENCY[currency].code} ${currencyData}` ;
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