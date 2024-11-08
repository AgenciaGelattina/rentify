export const LANG: {[foo:string]: string} = {
    APP_TITLE: "Rentify",
    LOGIN: "Login",
    PASSWORD_REQUIRED: "Password is Required"
}

export const DATE_FORMAT: {[foo:string]: string} = {
    MYSQL: "yyyy-MM-dd",
    MONTH_YEAR: "LLLL yyyy",
    DATE_LONG: "PPPP",
    DATE: "dd/MM/yyyy"
}

export type TCurrency = {
    [foo:string]: { text: string, code: string, local: string, prefix: string }
}

export const CURRENCY: TCurrency = {
    mxn: { text: "MXN - Pesos Mexicanos", code: "Mxn", local: 'es-MX', prefix: "$" },
    usd: { text: "USD - Dólar Estadounidense", code: "Usd", local: 'en-US', prefix: "U$" }
}