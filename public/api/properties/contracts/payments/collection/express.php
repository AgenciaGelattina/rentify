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

        array_push($express_charges, $express_charge);
    };
};

$contract->express_charges = $express_charges;

?>