<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../utils/constants.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));

    $query = "SELECT cp.id,cp.amount,cp.contract,pc.currency,JSON_OBJECT('id',cp.recurring,'label',crp.label) AS recurring,JSON_OBJECT('id',cp.type,'label',pt.label) AS type,cp.date,cp.clarifications FROM contracts_payments AS cp LEFT JOIN contracts_recurring_payments AS crp ON crp.id = cp.recurring LEFT JOIN payments_types AS pt on pt.id = cp.type LEFT JOIN property_contracts AS pc on pc.id = cp.contract WHERE cp.contract = $contract_id ORDER BY cp.date";
    $payments_query = $DB->query($query);

    $payments_data = new stdClass();
    $payments_data->payments = [];
    $payments_data->total_amount = 0;
    if ($payments_query && $payments_query->num_rows > 0) {
        while($row = $payments_query->fetch_object()) {
            $payments_data->total_amount += $row->amount;
            $row->recurring = json_decode($row->recurring, true);
            $row->type = json_decode($row->type, true);
            $row->date = addTMZero($row->date);
            array_push($payments_data->payments, $row);
        };
    }

    throwSuccess($payments_data);
    $DB->close();
}
?>