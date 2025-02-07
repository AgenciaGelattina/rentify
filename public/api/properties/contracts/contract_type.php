<?php
//require $contract
$contract_status = new stdClass();
$contract_statements = new stdClass();
$contract_has_debts = false;

if ($row->type === "recurring") {
    //---------- RECURRING
    //DUE DATE
    $due_date_day = checkDueDateDay($row->due_date);
    $due_date_day_time = strtotime(date('Y-m')."-".$due_date_day);
    $due_date_date = addTMZero(date('Y-m-d', $due_date_day_time));
    $due_date_time = new DateTime($due_date_date);
    
    if ($contract->expired) {
        $due_date_date = addTMZero($contract_end_date_time->format("Y-m-d"));
    } else if ($contract_start_date_time > $due_date_time) {
        $due_date_time->modify('+1 month');
        $due_date_date = addTMZero($due_date_time->format('Y-m-d'));
    }

    $due_date_time = new DateTime($due_date_date);
    $overdue_date_time = new DateTime($due_date_date);
    $overdue_date_time->add(new DateInterval("P5D"));
    
    $contract_due_date = new stdClass();
    $contract_due_date->day = $due_date_day;
    $contract_due_date->start = $due_date_date;
    $contract_due_date->end = addTMZero($overdue_date_time->format('Y-m-d'));
    $contract->due_date = $contract_due_date;

    //TOTAL MONTHS
    $contract_total_months = getTotalMonths($contract->start_date, $contract->end_date);
    $contract->total_months = $contract_total_months;

    //RENT DUE
    $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
    $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;

    // RECURRING CHARGES
    $query = "SELECT crp.id,crp.label,crp.value,crp.start_date,crp.end_date,crp.canceled,IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = crp.contract AND recurring = crp.id),0) AS total_amount FROM contracts_recurring_charges AS crp WHERE crp.contract = $contract->id";
    $rec_charges = $DB->query($query);

    $recurring_charges = [];

    // STATEMENTS
    $monthly_amount = 0;
    $contract_statements->required_amount = 0;
    $contract_statements->total_amount = 0;
    $contract_statements->pending_amount = 0;

    
    while($rec = $rec_charges->fetch_object()) {
        $recurring_charge = new stdClass();
        $recurring_charge->id = $rec->id;
        $recurring_charge->label = $rec->label;
        $recurring_charge->value = $rec->value;
        $recurring_charge->currency = $contract->currency;
        $recurring_charge->canceled = $rec->canceled ? true : false;
        $recurring_charge->start_date = addTMZero($rec->start_date);
        $rec_start_date_time = new DateTime($recurring_charge->start_date);
        $recurring_charge->end_date = addTMZero($rec->end_date);
        $rec_end_date_time = new DateTime($recurring_charge->end_date);
        $recurring_charge->expired = ($NOW->time > $rec_end_date_time) ? true : false;
        
        //TOTAL MONTHS
        $recurring_charge->total_months = getTotalMonths($recurring_charge->start_date,$recurring_charge->end_date);
        
        //CURRENT MONTH
        if ($contract->expired) {
            $recurring_charge->current_month = $recurring_charge->total_months;
        } else {
            $recurring_charge->current_month = getTotalMonths($recurring_charge->start_date,$NOW->date);
        }

        //STATUS
        $rec_statements = new stdClass();
        $rec_statements->required_amount = $rec->value * $recurring_charge->current_month;
        $rec_statements->total_amount = $rec->total_amount ? $rec->total_amount : 0;
        $rec_statements->pending_amount = abs($rec_statements->total_amount - $rec_statements->required_amount);

        // CONTRACT STATUS IF NOT CANCELED
        if ($recurring_charge->canceled === false) {
            $contract_statements->required_amount += $rec_statements->required_amount;
            $contract_statements->total_amount += $rec_statements->total_amount;
            $contract_statements->pending_amount += $rec_statements->pending_amount;
            $monthly_amount += $rec->value;
        }
        
        $rec_statements->pending_months = ceil($rec_statements->pending_amount / $rec->value);

        $rec_due_date = new stdClass();
        $rec_due_date->day = $due_date_day;
        if ($recurring_charge->expired) {
            $due_date_date = $rec_end_date_time->format("Y-m-d");
            $overdue_date_limit_date = $rec_end_date_time->format("Y-m-d");
        } else {
            $due_date_date = date("Y-m-".$due_date_day);
            $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
        }
        $rec_due_date->start = addTMZero($due_date_date);
        $rec_due_date->end = addTMZero($overdue_date_limit_date);
        $recurring_charge->due_date = $rec_due_date;

        //OVERDUE
        $rec_due_date->is_overdue = ($NOW->time > new DateTime($due_date_date))? true : false;

        $rec_status = new stdClass();
        if ($rec_start_date_time < $NOW->time) {
            if ($rec_statements->pending_amount > 0) {
                $contract_has_debts = true;
                $rec_status->label = PAYMENT_STATUS_LABEL[1];
                if ($rec_statements->pending_months > 0 ) {
                    $rec_status->severity = SEVERITY[2];
                } else {
                    $rec_status->label = PAYMENT_STATUS_LABEL[1];
                    $rec_status->severity = $rent_is_overdue ? SEVERITY[2] : SEVERITY[1];
                }
            } else { 
                $rec_status->label = PAYMENT_STATUS_LABEL[0];
                $rec_status->severity = SEVERITY[0];
            };
        } else {
            $rec_status->label = PAYMENT_STATUS_LABEL[2];
            $rec_status->severity = SEVERITY[3];
        };
        $recurring_charge->status = $rec_status;
        $recurring_charge->statements = $rec_statements;

        array_push($recurring_charges, $recurring_charge);
    }

    //CONTRACT PENDING MONTHS
    $contract_pending_months = $monthly_amount > 0 ? ceil($contract_statements->pending_amount / $monthly_amount) : 0;
    //$contract_payments_status->pending_months = $contract_pending_months;

    $contract->recurring_charges = $recurring_charges;

    //CONTRACT STATUS
    if ($contract_start_date_time < $NOW->time) {
        if ($contract_has_debts) {
            $contract_status->label = PAYMENT_STATUS_LABEL[1];
            $contract_status->severity = ($rent_is_overdue || $contract_pending_months > 0) ? SEVERITY[2] : SEVERITY[1];
        } else {
            $contract_status->label = PAYMENT_STATUS_LABEL[0];
            $contract_status->severity = SEVERITY[0];
        };
    } else {
        $contract_status->label = PAYMENT_STATUS_LABEL[2];
        $contract_status->severity = SEVERITY[3];
    }
} else {
    //---------- EXPRESS
    //DUE DATE
    $contract_due_date = new stdClass();
    $contract_due_date->day = $row->due_date;
    $contract_due_date->start = $contract->start_date;
    $contract_due_date->end = $contract->end_date;
    $contract->due_date = $contract_due_date;

    //RENT DUE
    $rent_is_due = ($NOW->time > $contract_end_date_time) ? true : false;

    // EXPRESS CHARGES
    $query = "SELECT cxc.id,cxc.label,cxc.value,cxc.canceled, IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = cxc.contract AND express = cxc.id),0) AS total_amount FROM contracts_express_charges AS cxc WHERE cxc.contract = $contract->id";
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
}

$contract->status = $contract_status;
$contract->statements = $contract_statements;
?>