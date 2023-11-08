
// RANDOM UNIQUE ID V1.0
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

// FORMAT MONEY
export const formatToMoney = (number: number | bigint): string => {
    console.log(new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MEX' }).format(number))
    return number.toString();
}