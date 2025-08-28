<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';

if (METHOD === 'GET') {
    require '../../database.php';

    // ACCOUNT ROLE CHECK
    $account = intval($DB->real_escape_string($_GET['account']));
    $account_query = $DB->query("SELECT ac.id,ac.role FROM accounts AS ac WHERE ac.id = $account AND ac.active=1");
    if ($account_query && $account_query->num_rows > 0) {
        $account = $account_query->fetch_object();

        $contracts_query = "SELECT pc.id,pc.type,pc.due_date,pc.start_date,pc.end_date,pc.in_date,pc.out_date,pc.currency,pc.canceled,pc.property AS property_id,pr.title AS property_title,pr.description AS property_description,pr.assignment,JSON_OBJECT('id',pt.id,'label',pt.label) AS property_type,JSON_OBJECT('id',pg.id,'title',pg.title,'description',pg.description) AS property_group,JSON_OBJECT('id',st.id,'label',st.label) AS property_status FROM property_contracts AS pc LEFT JOIN properties AS pr ON pr.id = pc.property LEFT JOIN properties_groups AS pg ON pg.id = pr.group LEFT JOIN properties_types AS pt ON pt.id = pr.type LEFT JOIN properties_status AS st ON st.id = pr.status WHERE pr.active = 1 AND pc.finalized = 0 AND pc.canceled = 0 AND DATEDIFF(pc.end_date,CURDATE()) < 60";

        if ($account->role > 2) {
            $contracts_query .= " AND pr.assignment = $account->id";
        };

        $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;
        if ($group > 0) {
            $contracts_query .= " AND pr.group = $group";
        };

        $contracts_query .= " ORDER BY pc.end_date ASC";

        $contracts_result = $DB->query($contracts_query);

        $expiration_data = [];
        if ($contracts_result && $contracts_result->num_rows > 0) {
            while ($row = $contracts_result->fetch_object()) {

                // CONTRACT
                $contract = new stdClass();
                $contract->id = $row->id;
                $contract->end_date = addTMZero($row->end_date);
                $contract->expired = $NOW->time > new DateTime($contract->end_date);

                $contract->id = $row->id;
                $contract->currency = $row->currency;
                $contract->type = $row->type;

                $contract->start_date = addTMZero($row->start_date);
                //$contract_start_date_time = new DateTime($row->start_date);
                $contract->end_date = addTMZero($row->end_date);
                $contract_end_date_time = new DateTime($row->end_date);

                $contract->in_date = addTMZero($row->in_date);
                //$contract_in_date_time = new DateTime($row->in_date);
                $contract->out_date = addTMZero($row->out_date);
                //$contract_out_date_time = new DateTime($row->out_date);

                $contract->expired = ($NOW->time > $contract_end_date_time) ? true : false;
                $contract->canceled = false;
                $contract->finalized = false;

                // PROPERTY
                $property = new stdClass();
                $property->id = $row->property_id;
                $property->title = $row->property_title;
                $property->description = $row->property_description;
                $property->active_contract = null;
                $property->group = json_decode($row->property_group, true);
                $property->type = json_decode($row->property_type, true);
                $property->status = json_decode($row->property_status, true);

                array_push($expiration_data, ['contract'=> $contract, 'property'=> $property]);
            };
        };
        throwSuccess($expiration_data);
    } else {
        throwError(203, "El usuario no está activado.");
    }
    $DB->close();
}
?>