<?php
// RECURRING CHARGES
$charges_query = "SELECT crp.id,crp.label,crp.value,crp.start_date,crp.end_date,crp.canceled,IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = crp.contract AND recurring = crp.id AND $year = YEAR(cp.date) AND $month = MONTH(cp.date)),0) AS total_amount FROM contracts_recurring_charges AS crp WHERE crp.canceled = 0 AND crp.contract = $contract->id AND ('$year_month' BETWEEN DATE_FORMAT(crp.start_date,'%Y-%m') AND DATE_FORMAT(crp.end_date,'%Y-%m'))"; 

/*(crp.start_date <= '$srch_start_date' AND crp.end_date >= '$srch_end_date')";*/

$rec_charges = $DB->query($charges_query);
$recurring_charges = [];
while($rec = $rec_charges->fetch_object()) {
    $recurring_charge = new stdClass();
    $recurring_charge->id = $rec->id;
    $recurring_charge->contract = $contract->id;
    $recurring_charge->label = $rec->label;
    $recurring_charge->value = $rec->value;
    $recurring_charge->currency = $contract->currency;
    $recurring_charge->canceled = false;
    $recurring_charge->start_date = addTMZero($rec->start_date);
    //$rec_start_date_time = new DateTime($recurring_charge->start_date);
    $recurring_charge->end_date = addTMZero($rec->end_date);
    $rec_end_date_time = new DateTime($recurring_charge->end_date);
    $recurring_charge->expired = ($NOW->time > $rec_end_date_time) ? true : false;

    //STATEMENTS
    $rec_statements = new stdClass();
    $rec_statements->required_amount = $rec->value;
    $rec_statements->total_amount = $rec->total_amount;
    $rec_statements->pending_payments = ($rec->total_amount < $rec->value) ? true : false;
    $rec_statements->pending_amount = $rec_statements->pending_payments ? abs($rec_statements->total_amount - $rec_statements->required_amount) : 0;

    // PAYMENT LIST
    $payments_query = "SELECT cp.id,cp.contract,cp.recurring,cp.amount,cp.date,cp.clarifications,cp.confirmed FROM contracts_payments AS cp WHERE cp.recurring = $recurring_charge->id AND $year = YEAR(cp.date) AND $month = MONTH(cp.date)";

    $rec_payments = $DB->query($payments_query);

    $payment_data = new stdClass();
    $payment_data->payments = [];
    $payment_data->total_amount = 0;
    while($pmnt = $rec_payments->fetch_object()) {
        $payment = new stdClass();
        $payment = $pmnt;
        $pmnt->currency = $recurring_charge->currency;
        $payment_data->total_amount = $payment_data->total_amount + $payment->amount;
        $payment->confirmed = boolval($pmnt->confirmed);
        array_push($payment_data->payments, $payment);
    };
    $payment_data->pending_amount = $payment_data->total_amount - $recurring_charge->value;
    $recurring_charge->payments = $payment_data;

    $rec_status = new stdClass();
    $rec_status->label = PAYMENT_STATUS_LABEL[2];
    $rec_status->severity = SEVERITY[3];

    if ($rent_is_due || $recurring_charge->expired) {
        if ($rec_statements->pending_payments) {
            $rec_status->label = PAYMENT_STATUS_LABEL[1];
            $rec_status->severity = SEVERITY[1];
            if ($rent_is_overdue) {
                $rec_status->severity = SEVERITY[2];
            };
        } else {
            $rec_status->label = PAYMENT_STATUS_LABEL[0];
            $rec_status->severity = SEVERITY[0];
        };
    };

    $recurring_charge->status = $rec_status;
    $recurring_charge->statements =  $rec_statements;
    
    array_push($recurring_charges, $recurring_charge);
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

array_push($recurring_charges, $extra_charge);

$contract->recurring_charges = $recurring_charges;
?>