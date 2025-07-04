import { IExpressCharge } from "./Express/Details";
import { IRecurringCharge } from "./Recurring/Detail";

export type TCharge = IExpressCharge | IRecurringCharge;