import { FC, useContext, useEffect, useState } from "react";
import { IContract } from "@src/Components/Properties/Contracts/Details";
import { IPayment, TPaymentType } from "../..";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { Controller, FieldValues, useForm } from "react-hook-form";
import RspDialog from "@src/Components/RspDialog";
import RspDialogTitle from "@src/Components/RspDialog/RspDialogTitle";
import { clone, isNil, isNotNil } from "ramda";
import { Button, DialogActions, DialogContent, Divider, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextFieldMoney from "@src/Components/Forms/TextFieldMoney";
import { fieldError, formatDate } from "@src/Utils";
import { DatePicker } from "@mui/x-date-pickers";
import PaymentTypeSelector from "@src/Components/Forms/PaymentType";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import RecurringChargesSelector from "@src/Components/Forms/ChargesSelector/RecurringCharges";
import ExpressChargesSelector from "@src/Components/Forms/ChargesSelector/ExpressCharges";
import { StoreContext } from "@src/DataProvider";

export interface IExpressPaymentData {
    id: number;
    contract: number;
    express: number;
    amount: number;
    date: Date;
    clarifications: string;
}

export interface IExpressPaymentForm {
    payment_date: Date;
    open: boolean;
    payment?: IPayment;
};

interface IExpressPaymentFormProps extends IExpressPaymentForm {
    contract: IContract;
    setOpen: (paymentFormData: IExpressPaymentForm) => void;
    getPayments: () => void;
};

export const expressPaymentFormDefault: IExpressPaymentForm = { open: false, payment_date: new Date };

const formValidations = yup.object().shape({
    id: yup.number().required(),
    contract: yup.number().required(),
    express: yup.number(),
    amount: yup.number().min(1),
    date: yup.date(),
    clarifications: yup.string(),
});

const defaultExpressPaymentData = (contract: IContract, payment_date: Date = new Date): IExpressPaymentData => {
    return {
        id: 0,
        contract: contract.id,
        express: 0,
        amount: 0,
        date: payment_date,
        clarifications: ""
    }
}

const ExpressPaymentForm:  FC<IExpressPaymentFormProps> = ({ payment, open, contract, payment_date, setOpen, getPayments }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const { handleSubmit, control, setError, watch, setValue, formState: { errors }, reset } = useForm({ defaultValues: defaultExpressPaymentData(contract, payment_date), resolver: yupResolver(formValidations) });
    const [paymentType, setPaymentType] = useState<TPaymentType>("unique");
    //const { isDirty } = useFormState({ control });

    const closePaymentForm = () => {
        setOpen(expressPaymentFormDefault);
    };

    useEffect(() => {
        if (open) {
            if (isNotNil(payment)) {
                const { type, express, date, ...rest } = payment;
                setPaymentType(type);
                const paymentData: IExpressPaymentData = {
                    ...rest,
                    express: express ? express.id : 0,
                    date: new Date(payment.date || ""),
                    contract: contract.id
                };
                reset(paymentData);
            }
        }
        return () => {
            setPaymentType("unique");
            reset(defaultExpressPaymentData(contract));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contract, payment, reset]);

    const onFormSubmit = (data: FieldValues) => {
        const { date } = clone(data);

        if (isNil(date)) {
            setError('date', { type: "error", message: "Seleccione una fecha de pago." });
            return false;
        }

        //fix date format
        data.date = formatDate(date);

        //role data
        data.confirmed = (user.role < 3) ? 1 : 0;

        fetchData.post('/properties/contracts/payments/express/payment.php', data, (response: TCallBack) => {
            const saved = validateResult(response.result);
            if (saved) {
                getPayments();
                closePaymentForm();
            }
        });
    };

    const dialogLabel = isNil(payment) ?  'REGISTRAR PAGO' :  'EDITAR PAGO';

    return (<RspDialog open={open} maxWidth="sm" onClose={closePaymentForm} >
        <RspDialogTitle title={dialogLabel} onClose={closePaymentForm} />
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="amount" control={control} render={({ field }) => {
                        return <TextFieldMoney {...field} label="Pago" {...fieldError(errors.amount)} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="date" control={control} render={({ field }) => {
                        return <DatePicker
                            label="Fecha de pago" {...field}
                            format="dd/MM/yyyy"
                            minDate={new Date(contract.start_date || "")}
                            maxDate={new Date("now")}
                            onChange={(selectedDate: Date | null) => field.onChange(selectedDate)}
                        />
                    }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PaymentTypeSelector
                        id="paymentType"
                        value={paymentType}
                        paymentTypes={["unique", "extraordinary"]}
                        onChange={(e) => {
                            const { target } = e;
                            const type = target.value as TPaymentType;
                            setPaymentType(type);
                            if(type === "extraordinary") {
                                setValue('express', 0);
                            }
                        }}
                    />
                </Grid>
                {paymentType === "unique" && (<Grid size={{ xs: 12, md: 6 }}>
                    <Controller name="express" control={control} render={({ field }) => {
                        return <ExpressChargesSelector {...field} setValue={(defaultValue: number) => setValue('express', defaultValue)} contract={contract.id} onChange={(e) => field.onChange(e)} />
                    }} />
                </Grid>)}
                <Grid size={12}>
                    <Controller name="clarifications" control={control} render={({ field }) => {
                        return <TextField {...field} label="Aclaraciones" multiline maxRows={4} type="text" onChange={(e) => field.onChange(e)} fullWidth />
                    }} />
                </Grid>
            </Grid>
            <Divider />
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleSubmit((data) => onFormSubmit(data))}>{dialogLabel}</Button>
        </DialogActions>
    </RspDialog>);
};

export default ExpressPaymentForm;