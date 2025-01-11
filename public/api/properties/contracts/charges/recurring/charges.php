<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../utils/constants.php';

if (METHOD === 'POST') {
    require_once '../../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract_id = intval($DB->real_escape_string(POST['contract']));
    $label = $DB->real_escape_string(POST['label']);
    $value = intval($DB->real_escape_string(POST['value']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);

    if ($id > 0) {
        $DB->query("UPDATE contracts_recurring_charges SET value=$value,label='$label',start_date='$start_date',end_date='$end_date' WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo modificar el Cobro Mensual #$id");
        }
    } else {
        $DB->query("INSERT INTO contracts_recurring_charges (contract,label,value,start_date,end_date) VALUES ($contract_id,'$label',$value,'$start_date','$end_date')");
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo crear el Cobro Mensual.");
        }
    }
    $DB->close();
}

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract']));

    $query = "SELECT crp.id,crp.label,crp.value,pc.currency,pc.due_date,crp.start_date,crp.end_date,crp.canceled,IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = crp.contract AND recurring = crp.id), 0) AS total_amount FROM contracts_recurring_charges AS crp LEFT JOIN property_contracts AS pc ON pc.id = crp.contract WHERE crp.contract = $contract_id";
    $rec_charges_result = $DB->query($query);
    if ($rec_charges_result->num_rows > 0) {
        $recurring_charges = [];
        while($rec = $rec_charges_result->fetch_object()) {
            $recurring_charge = new stdClass();
            $recurring_charge->id = $rec->id;
            $recurring_charge->label = $rec->label;
            $recurring_charge->value = $rec->value;
            $recurring_charge->currency = $rec->currency;
            $recurring_charge->canceled = $rec->canceled ? true : false;
            $recurring_charge->start_date = addTMZero($rec->start_date);
            $rec_start_date_time = new DateTime($recurring_charge->start_date);
            $recurring_charge->end_date = addTMZero($rec->end_date);
            $rec_end_date_time = new DateTime($recurring_charge->end_date);
            $recurring_charge->expired = ($NOW->time > $rec_end_date_time)? true : false;
            
            //TOTAL MONTHS
            $recurring_charge->total_months = getTotalMonths($recurring_charge->start_date,$recurring_charge->end_date);
            
            //CURRENT MONTH
            $recurring_charge->current_month = getTotalMonths($recurring_charge->start_date,$NOW->date);

            //STATUS
            $rec_payment_status = new stdClass();
            $rec_payment_status->required_amount = $rec->value * $recurring_charge->current_month;
            $rec_payment_status->total_amount = $rec->total_amount;
            $rec_payment_status->pending_amount = abs($rec_payment_status->total_amount - $rec_payment_status->required_amount);
            $rec_payment_status->pending_months = ceil($rec_payment_status->pending_amount / $rec->value);

            $rec_due_date = new stdClass();
            $rec_due_date->day = $rec->due_date;
            if ($recurring_charge->expired) {
                $due_date_date = $rec_end_date_time->format("Y-m-d");
                $overdue_date_limit_date = $rec_end_date_time->format("Y-m-d");
            } else {
                $due_date_date = date("Y-m-".$rec_due_date->day);
                $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
            }
            $rec_due_date->start = addTMZero($due_date_date);
            $rec_due_date->end = addTMZero($overdue_date_limit_date);
            $recurring_charge->due_date = $rec_due_date;

            //OVERDUE
            $rec_due_date->is_overdue = ($NOW->time > new DateTime($due_date_date))? true : false;

            $rec_status = new stdClass();
            if ($rec_start_date_time < $NOW->time) {
                if ($rec_payment_status->pending_amount > 0) {
                    $contract_has_debts = true;
                    $rec_status->label = PAYMENT_STATUS_LABEL[1];
                    if ($rec_payment_status->pending_months > 0 ) {
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
            }
            $rec_payment_status->status = $rec_status;

            $recurring_charge->payments_status = $rec_payment_status;
            array_push($recurring_charges, $recurring_charge);
        }
        throwSuccess($recurring_charges);
    } else {
        throwError(203, "No hay Cobros Mensuales.");
    };

    $DB->close();
}
?>