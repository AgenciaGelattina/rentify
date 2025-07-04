<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'POST') {
    require_once '../../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract_id = intval($DB->real_escape_string(POST['contract']));
    $label = $DB->real_escape_string(POST['label']);
    $value = intval($DB->real_escape_string(POST['value']));

    if ($id > 0) {
        $payment = $DB->query("UPDATE contracts_express_charges SET value=$value,label='$label' WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo modificar el pago express #$id");
        }
    } else {
        $query ="INSERT INTO contracts_express_charges (contract,label,value) VALUES ($contract_id,'$label',$value)";
        $property_result = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo crear el Cobro.");
        }
    }
    $DB->close();
}

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract']));

    $query = "SELECT cxc.id,cxc.label,cxc.value,pc.currency,pc.start_date,pc.end_date,cxc.canceled,IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = cxc.contract AND express = cxc.id), 0) AS total_amount FROM contracts_express_charges AS cxc LEFT JOIN property_contracts AS pc ON pc.id = cxc.contract WHERE cxc.contract = $contract_id";
    $exp_charges_query = $DB->query($query);
    if ($exp_charges_query->num_rows > 0) {
        $express_charges = [];
        while($exp=$exp_charges_query->fetch_object()) {
            $express_charge = new stdClass();
            $express_charge->id = $exp->id;
            $express_charge->contract = $contract_id;
            $express_charge->label = $exp->label;
            $express_charge->value = $exp->value;
            $express_charge->currency = $exp->currency;
            $express_charge->canceled = $exp->canceled ? true : false;
            $express_charge->start_date = addTMZero($exp->start_date);
            $exp_start_date_time = new DateTime($express_charge->start_date);
            $express_charge->end_date = addTMZero($exp->end_date);
            $exp_end_date_time = new DateTime($express_charge->end_date);
            $express_charge->expired = ($NOW->time > $exp_end_date_time)? true : false;

            //TOTAL DAYS
            $express_charge->total_days = getTotalDays($express_charge->start_date,$express_charge->end_date);
            $express_charge->pending_days = getTotalDays($express_charge->end_date,$NOW->date);
            $express_charge->current_day = ($express_charge->pending_days > $express_charge->total_days) ? 0 : $express_charge->total_days - $express_charge->pending_days;

            //STATUS
            $exp_payment_status = new stdClass();
            $exp_payment_status->required_amount = $exp->value;
            $exp_payment_status->total_amount = $exp->total_amount;
            $exp_payment_status->pending_amount = abs($exp_payment_status->total_amount - $exp_payment_status->required_amount);

            //OVERDUE
            $exp_payment_status->is_overdue = ($NOW->time > $exp_end_date_time) ? true : false;

            $exp_status = new stdClass();
            if ($exp_start_date_time < $NOW->time) {
                if ($exp_payment_status->pending_amount > 0) {
                    $exp_status->label = PAYMENT_STATUS_LABEL[1];
                    if ($express_charge->pending_days > 0 ) {
                        $exp_status->severity = SEVERITY[2];
                    } else {
                        $exp_status->label = PAYMENT_STATUS_LABEL[1];
                        $exp_status->severity = $rent_is_overdue ? SEVERITY[2] : SEVERITY[1];
                    }
                } else {
                    $exp_status->label = PAYMENT_STATUS_LABEL[0];
                    $exp_status->severity = SEVERITY[0];
                };
            } else {
                $exp_status->label = PAYMENT_STATUS_LABEL[2];
                $exp_status->severity = SEVERITY[3];
            }
            $exp_payment_status->status = $exp_status;
            $express_charge->payments_status = $rec_payment_status;

            array_push($express_charges, $express_charge);
        }
        throwSuccess($express_charges);
    } else {
        throwError(203, "No se encontraron Cobros.");
    };
    $DB->close();
}
?>