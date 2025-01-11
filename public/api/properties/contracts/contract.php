<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../database.php';

if (METHOD === 'GET') {
    
    $status = $DB->real_escape_string($_GET['status']);
    $query = "SELECT id,property,type,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts";

    if ($status === "current") {
        $property = intval($DB->real_escape_string($_GET['property_id']));
        $query .= " WHERE property = $property AND canceled = 0 AND finalized = 0 AND end_date >= CURDATE()";
    }
    if ($status === "data") {
        $contract = intval($DB->real_escape_string($_GET['contract_id']));
        $query .= " WHERE id = $contract";
    }
    
    $contract_result = $DB->query($query);
    
    if ($contract_result->num_rows > 0) {
        $row = $contract_result->fetch_object();

        // CONTRACT
        $contract = new stdClass();
        $contract->id = $row->id;
        $contract->currency = $row->currency;
        $contract->type = $row->type;

        $contract->start_date = addTMZero($row->start_date);
        $contract_start_date_time = new DateTime($row->start_date);
        $contract->end_date = addTMZero($row->end_date);
        $contract_end_date_time = new DateTime($row->end_date);

        $contract->in_date = addTMZero($row->in_date);
        //$contract_in_date_time = new DateTime($row->in_date);
        $contract->out_date = addTMZero($row->out_date);
        //$contract_out_date_time = new DateTime($row->out_date);

        $contract->expired = ($NOW->time > $contract_end_date_time) ? true : false;
        $contract->canceled = $row->canceled == 0 ? false : true;
        $contract->finalized = $row->finalized == 0 ? false : true;

        $contract_has_debts = false;
        if ($row->type === "recurring") {
            //---------- RECURRING
            //DUE DATE
            $due_date_day = checkDueDateDay($row->due_date);
            $due_date_day_time = strtotime(date('Y-m')."-".$due_date_day);
            $due_date_date = addTMZero(date('Y-m-d', $due_date_day_time));
            $due_date_time = new DateTime($due_date_date);
            
            if ($contract->expired) {
                $due_date_date = $contract_end_date_time->format("Y-m-d");
            } else if ($contract_start_date_time > $due_date_time) {
                $due_date_time->modify('+1 month');
                $due_date_date = $due_date_time->format('Y-m-d');
            }

            $due_date_time = new DateTime($due_date_date);
            $overdue_date_time = new DateTime($due_date_date);
            $overdue_date_time->add(new DateInterval("P5D"));
            
            $contract_due_date = new stdClass();
            $contract_due_date->day = $due_date_day;
            $contract_due_date->start = addTMZero(date('Y-m-d', $due_date_day_time));
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

            $contract_payments_status = new stdClass();
            $contract_payments_status->monthly_amount = 0;
            $contract_payments_status->required_amount = 0;
            $contract_payments_status->total_amount = 0;
            $contract_payments_status->pending_amount = 0;

            
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
                $recurring_charge->expired = ($NOW->time > $rec_end_date_time)? true : false;
                
                //TOTAL MONTHS
                $recurring_charge->total_months = getTotalMonths($recurring_charge->start_date,$recurring_charge->end_date);
                
                //CURRENT MONTH
                $recurring_charge->current_month = getTotalMonths($recurring_charge->start_date,$NOW->date);

                //STATUS
                $rec_payment_status = new stdClass();
                $rec_payment_status->required_amount = $rec->value * $recurring_charge->current_month;
                $rec_payment_status->total_amount = $rec->total_amount ? $rec->total_amount : 0;
                $rec_payment_status->pending_amount = abs($rec_payment_status->total_amount - $rec_payment_status->required_amount);

                // CONTRACT STATUS IF NOT CANCELED
                if ($recurring_charge->canceled === false) {
                    $contract_payments_status->required_amount += $rec_payment_status->required_amount;
                    $contract_payments_status->total_amount += $rec_payment_status->total_amount;
                    $contract_payments_status->pending_amount += $rec_payment_status->pending_amount;
                    $contract_payments_status->monthly_amount += $rec->value;
                }
                
                $rec_payment_status->pending_months = ceil($rec_payment_status->pending_amount / $rec->value);

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
                };
                $rec_payment_status->status = $rec_status;

                $recurring_charge->payments_status = $rec_payment_status;
                array_push($recurring_charges, $recurring_charge);
            }

            //CONTRACT PENDING MONTHS
            $contract_pending_months = $contract_payments_status->monthly_amount > 0 ? ceil($contract_payments_status->pending_amount / $contract_payments_status->monthly_amount) : 0;
            $contract_payments_status->pending_months = $contract_pending_months;

            $contract->payments_status = $contract_payments_status;
            $contract->recurring_charges = $recurring_charges;
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

            $contract_payments_status = new stdClass();
            $contract_payments_status->required_amount = 0;
            $contract_payments_status->total_amount = 0;
            $contract_payments_status->pending_amount = 0;

            $contract_has_debts = false;
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
                    $exp_payment_status = new stdClass();
                    $exp_payment_status->required_amount = $express_charge->value;
                    $exp_payment_status->total_amount = $exp->total_amount;
                    $exp_payment_status->pending_amount = abs($exp_payment_status->total_amount - $exp_payment_status->required_amount);

                    // CONTRACT STATUS IF NOT CANCELED
                    if ($express_charge->canceled === false) {
                        $contract_payments_status->required_amount += $exp_payment_status->required_amount;
                        $contract_payments_status->total_amount += $exp_payment_status->total_amount;
                        $contract_payments_status->pending_amount += $exp_payment_status->pending_amount;
                    }

                    //OVERDUE
                    $exp_payment_status->is_overdue = ($NOW->time > $contract_end_date_time) ? true : false;

                    $exp_status = new stdClass();
                    if ($exp_start_date_time < $NOW->time) {
                        if ($exp_payment_status->pending_amount > 0) {
                            $exp_status->label = PAYMENT_STATUS_LABEL[1];
                            if ($express_charge->pending_days > 0 ) {
                                $exp_status->severity = SEVERITY[2];
                            } else {
                                $exp_status->label = PAYMENT_STATUS_LABEL[1];
                                $exp_status->severity = $exp_payment_status->is_overdue ? SEVERITY[2] : SEVERITY[1];
                            }
                        } else {
                            $exp_status->label = PAYMENT_STATUS_LABEL[0];
                            $exp_status->severity = SEVERITY[0];
                        };
                    } else {
                        $exp_status->label = PAYMENT_STATUS_LABEL[2];
                        $exp_status->severity = SEVERITY[3];
                    };
                    $exp_payment_status->status = $exp_status;
                    $express_charge->payments_status = $exp_payment_status;

                    array_push($express_charges, $express_charge);
                };
            };

            $contract->payments_status = $contract_payments_status;
            $contract->express_charges = $express_charges;
        }

        //CONTRACT STATUS
        $contract_status = new stdClass();
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

        $contract->status = $contract_status;
        
        throwSuccess($contract);
    } else {
        throwSuccess(["id"=>0]);
    }
    $DB->close();
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $property = intval($DB->real_escape_string(POST['property']));
    $type = $DB->real_escape_string(POST['type']);
    $currency = $DB->real_escape_string(POST['currency']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);
    $in_date = $DB->real_escape_string(POST['in_date']);
    $out_date = $DB->real_escape_string(POST['out_date']);

    if ($id > 0) { 
        $fields = "due_date=$due_date,currency='$currency',start_date='$start_date',end_date='$end_date',in_date='$in_date',out_date='$out_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El contrato fue modificado.");
        } else {
            throwError(203, "Error al modificar contrato $id");
        }
    } else {
        $value = $DB->real_escape_string(POST['value']);

        $query_contract ="INSERT INTO property_contracts (`property`,`type`,`currency`,`due_date`,`start_date`,`end_date`,`in_date`,`out_date`) VALUES ($property,'$type','$currency',$due_date,'$start_date','$end_date','$in_date','$out_date')";
        $property_result = $DB->query($query_contract);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            // default recurrent payment
            if ($type === "recurring") { 
                $query_payment ="INSERT INTO contracts_recurring_charges (contract,label,value,start_date,end_date) VALUES ($newID,'Renta','$value','$start_date','$end_date')";
            } else {
                $query_payment ="INSERT INTO contracts_express_charges (contract,label,value) VALUES ($newID,'Renta','$value')";
            }
            $payment_result = $DB->query($query_payment);

            // default folders
            $query_folders = "INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ";
            $folders = [];
            foreach(POST['folders'] as $key => $folder) {
                $name = $folder['name'];
                $title = $folder['title'];
                $description = $folder['description'];
                array_push($folders, "('$name',$newID,'$title','$description',CURDATE())");
            }
            $query_folders .= implode(",", $folders);
            $folders_result = $DB->query($query_folders);

            throwSuccess(true, "El contrato con ID #$newID ha sido creado.");
        }else {
            throwError(203, "No se pudo crear el contrato");
        }
    }
    $DB->close();
}
?>