<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../utils/constants.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));

    $query = "SELECT cp.id,cp.amount,cp.contract,pc.currency,IF(cp.recurring > 0, JSON_OBJECT('id',cp.recurring,'label',crch.label), NULL) AS recurring,cp.date,cp.clarifications,confirmed FROM contracts_payments AS cp LEFT JOIN contracts_recurring_charges AS crch ON crch.id = cp.recurring LEFT JOIN property_contracts AS pc on pc.id = cp.contract WHERE cp.contract = $contract_id ORDER BY cp.date";
    $payments_query = $DB->query($query);

    $payments_data = new stdClass();
    $payments_data->payments = [];
    $payments_data->total_amount = 0;
    if ($payments_query && $payments_query->num_rows > 0) {
        while($row = $payments_query->fetch_object()) {
            if ($row->confirmed === 1) {
                $payments_data->total_amount += $row->amount;
            }
            if(is_null($row->recurring)) {
                $row->type = "extraordinary";
            } else {
                $row->recurring = json_decode($row->recurring, true);
                $row->type = "monthly";
            }
            $row->date = addTMZero($row->date);
            $row->confirmed = $row->confirmed === 1 ? true : false;
            array_push($payments_data->payments, $row);
        };
    }

    throwSuccess($payments_data);
    $DB->close();
}
?>