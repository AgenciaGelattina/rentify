<?php
//require $contract
$contract_status = new stdClass();
$contract_statements = new stdClass();
$contract_has_debts = false;

//---------- EXPRESS
//DUE DATE
$contract_due_date = new stdClass();
$contract_due_date->day = addZero($row->due_date);
$contract_due_date->start = $contract->start_date;
$contract_due_date->end = $contract->end_date;
$contract->due_date = $contract_due_date;

//RENT DUE
$rent_is_due = ($NOW->time > $contract_end_date_time) ? true : false;

// EXPRESS CHARGES
$query = "SELECT cxc.id,cxc.label,cxc.value,cxc.canceled, IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = cxc.contract AND express = cxc.id AND confirmed = 1),0) AS total_amount FROM contracts_express_charges AS cxc WHERE cxc.contract = $contract->id";
$exp_charges_query = $DB->query($query);

$express_charges = [];

// STATEMENTS
$contract_statements->required_amount = 0;
$contract_statements->total_amount = 0;
$contract_statements->pending_amount = 0;

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

        //TOTAL DAYS
        $express_charge->total_days = getTotalDays($express_charge->start_date,$express_charge->end_date);
        $express_charge->pending_days = getTotalDays($express_charge->end_date,$NOW->date);
        $express_charge->current_day = ($express_charge->pending_days > $express_charge->total_days) ? 0 : $express_charge->total_days - $express_charge->pending_days;

        //STATUS
        $exp_statements = new stdClass();
        $exp_statements->required_amount = $express_charge->value;
        $exp_statements->total_amount = $exp->total_amount;
        $exp_statements->pending_amount = abs($exp_statements->total_amount - $exp_statements->required_amount);

        // CONTRACT STATUS IF NOT CANCELED
        if ($express_charge->canceled === false) {
            $contract_statements->required_amount += $exp_statements->required_amount;
            $contract_statements->total_amount += $exp_statements->total_amount;
            $contract_statements->pending_amount += $exp_statements->pending_amount;
        }

        //OVERDUE
        $exp_statements->is_overdue = ($NOW->time > $contract_end_date_time) ? true : false;

        $exp_status = new stdClass();
        if ($exp_start_date_time < $NOW->time) {
            if ($exp_statements->pending_amount > 0) {
                $exp_status->label = PAYMENT_STATUS_LABEL[1];
                if ($express_charge->pending_days > 0 ) {
                    $exp_status->severity = SEVERITY[2];
                } else {
                    $exp_status->label = PAYMENT_STATUS_LABEL[1];
                    $exp_status->severity = $exp_statements->is_overdue ? SEVERITY[2] : SEVERITY[1];
                }
            } else {
                $exp_status->label = PAYMENT_STATUS_LABEL[0];
                $exp_status->severity = SEVERITY[0];
            };
        } else {
            $exp_status->label = PAYMENT_STATUS_LABEL[2];
            $exp_status->severity = SEVERITY[3];
        };
        $express_charge->status = $exp_status;
        $express_charge->statements = $exp_statements;

        array_push($express_charges, $express_charge);
    };
};

$contract->express_charges = $express_charges;

//CONTRACT STATUS
$contract_has_debts = $contract_statements->pending_amount > 0 ? true : false;

if ($contract_start_date_time < $NOW->time) {
    if ($contract_has_debts) {
        $contract_status->label = PAYMENT_STATUS_LABEL[1];
        $contract_status->severity = $contract->expired ? SEVERITY[2] : SEVERITY[1];
    } else {
        $contract_status->label = PAYMENT_STATUS_LABEL[0];
        $contract_status->severity = SEVERITY[0];
    };
} else {
    $contract_status->label = PAYMENT_STATUS_LABEL[2];
    $contract_status->severity = SEVERITY[3];
}


$contract->status = $contract_status;
$contract->statements = $contract_statements;
?>