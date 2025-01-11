import { TContractType } from "@src/Components/Properties/Contracts/Details"
import { TPaymentType } from "@src/Components/Properties/Contracts/Payments"

export const LANG: Record<string, string> = {
    APP_TITLE: "Rentify",
    LOGIN: "Login",
    PASSWORD_REQUIRED: "Password is Required"
}

export const DATE_FORMAT: Record<string, string> = {
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
 
export const CONTRACT_TYPE: Record<TContractType, string> = {
    recurring: "Recurrente",
    express: "Express"
}

export const PAYMENT_TYPE: Record<TPaymentType, string>  = {
    unique: "Único",
    monthly: "Mensual",
    extraordinary: "Extraordinario"
} 