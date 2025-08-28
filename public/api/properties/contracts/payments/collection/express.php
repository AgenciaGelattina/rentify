<?php

//---------- EXPRESS
//DUE DATE
$contract_due_date = new stdClass();
$contract_due_date->day = addZero($row->due_date);
$contract_due_date->start = $contract->start_date;
$contract_due_date->end = $contract->end_date;
$contract->due_date = $contract_due_date;

// EXPRESS CHARGES
$charges_query = "SELECT cxc.id,cxc.label,cxc.value,cxc.canceled, IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = cxc.contract AND express = cxc.id),0) AS total_amount FROM contracts_express_charges AS cxc WHERE cxc.contract = $contract->id AND cxc.canceled = 0";
$exp_charges_query = $DB->query($charges_query);

$express_charges = [];

if ($exp_charges_query->num_rows > 0) {
    while($exp=$exp_charges_query->fetch_object()) {
        $express_charge = new stdClass();
        $express_charge->id = $exp->id;
        $express_charge->contract = $contract->id;
        $express_charge->label = $exp->label;
        $express_charge->value = $exp->value;
        $express_charge->currency = $contract->currency;
        $express_charge->canceled = $exp->canceled ? true : false;
        $express_charge->start_date = $contract->start_date;
        $exp_start_date_time = new DateTime($express_charge->start_date);
        $express_charge->end_date = $contract->end_date;
        $express_charge->expired = ($NOW->time > $contract_end_date_time)? true : false;

        //STATEMENTS
        $exp_statements = new stdClass();
        $exp_statements->required_amount = $exp->value;
        $exp_statements->total_amount = $exp->total_amount;
        $exp_statements->pending_payments = ($exp->total_amount < $exp->value) ? true : false;
        $exp_statements->pending_amount = $exp_statements->pending_payments ? abs($exp_statements->total_amount - $exp_statements->required_amount) : 0;

        // PAYMENT LIST
        $payments_query = "SELECT cp.id,cp.contract,cp.express,cp.amount,cp.date,cp.clarifications,cp.confirmed FROM contracts_payments AS cp WHERE cp.express = $express_charge->id AND $year = YEAR(cp.date) AND $month = MONTH(cp.date)";

        $exp_payments = $DB->query($payments_query);

        $payment_data = new stdClass();
        $payment_data->payments = [];
        $payment_data->total_amount = 0;
        while($pmnt = $exp_payments->fetch_object()) {
            $payment = new stdClass();
            $payment = $pmnt;
            $pmnt->currency = $express_charge->currency;
            $payment_data->total_amount = $payment_data->total_amount + $payment->amount;
            $payment->confirmed = boolval($pmnt->confirmed);
            array_push($payment_data->payments, $payment);
        };
        $payment_data->pending_amount = $payment_data->total_amount - $express_charge->value;
        $express_charge->payments = $payment_data;

        $exp_status = new stdClass();
        $exp_status->label = PAYMENT_STATUS_LABEL[2];
        $exp_status->severity = SEVERITY[3];

        if ($rent_is_due || $express_charge->expired) {
            if ($rec_statements->pending_payments) {
                $exp_status->label = PAYMENT_STATUS_LABEL[1];
                $exp_status->severity = SEVERITY[1];
                if ($rent_is_overdue) {
                    $exp_status->severity = SEVERITY[2];
                };
            } else {
                $exp_status->label = PAYMENT_STATUS_LABEL[0];
                $exp_status->severity = SEVERITY[0];
            };
        };

        $express_charge->status = $exp_status;
        $express_charge->statements =  $exp_statements;

        array_push($express_charges, $express_charge);
    };
};


//-------------------------> EXTRAORDINARY CHARGES
$extra_charge = new stdClass();
$extra_charge->id = 0;
$extra_charge->contract = $contract->id;
$extra_charge->label = "Pago Extraordinario";
$extra_charge->value = 0;
$extra_charge->currency = $contract->currency;
$extra_charge->canceled = false;
$extra_charge->start_date = $contract->in_date;
$extra_charge->end_date = $contract->out_date;
$extra_charge_end_date_time = new DateTime($extra_charge->end_date);
$extra_charge->expired = boolval($NOW->time > $rec_end_date_time);

$exrec_statements = new stdClass();
$exrec_statements->required_amount = 0;

// PAYMENT LIST
$ex_payments_query = "SELECT cp.id,cp.contract,cp.amount,cp.date,cp.clarifications,cp.confirmed FROM contracts_payments AS cp WHERE cp.contract = $contract->id AND cp.recurring = 0 AND cp.express = 0 AND $year = YEAR(cp.date) AND $month = MONTH(cp.date)";

$ex_rec_payments = $DB->query($ex_payments_query);

$exrec_payment_data = new stdClass();
$exrec_payment_data->query = $ex_payments_query;
$exrec_payment_data->payments = [];
$exrec_payment_data->total_amount = 0;
while($pmnt = $ex_rec_payments->fetch_object()) {
    $payment = new stdClass();
    $payment = $pmnt;
    $pmnt->currency = $extra_charge->currency;
    $exrec_payment_data->total_amount = $exrec_payment_data->total_amount + $pmnt->amount;
    $payment->confirmed = boolval($pmnt->confirmed);
    array_push($exrec_payment_data->payments, $payment);
};
$exrec_statements->total_amount = $exrec_payment_data->total_amount;
$exrec_payment_data->pending_amount = 0;
$extra_charge->payments = $exrec_payment_data;
$exrec_statements->pending_amount = 0;
$exrec_statements->pending_payments = true;
$extra_charge->statements =  $exrec_statements;

$rec_status = new stdClass();
$rec_status->label = PAYMENT_STATUS_LABEL[2];
$rec_status->severity = SEVERITY[3];
$extra_charge->status = $rec_status;

array_push($express_charges, $extra_charge);

$contract->express_charges = $express_charges;

?>