<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../utils/constants.php';

if (METHOD === 'GET') {
    require '../../../../database.php';

    $year = intval($DB->real_escape_string($_GET['year']));
    $month = addZero(intval($DB->real_escape_string($_GET['month'])));
    $year_month = "$year-$month";
    //$srch_start_date = date('Y-m-d', strtotime("$year-$month-01"));
    //$srch_end_date = date('Y-m-t', strtotime($srch_start_date));

    $contracts_query = "SELECT pc.id,pc.type,pc.due_date,pc.start_date,pc.end_date,pc.in_date,pc.out_date,pc.currency,pc.canceled,pc.property AS property_id,pr.title AS property_title,pr.description AS property_description,JSON_OBJECT('id',pt.id,'label',pt.label) AS property_type,JSON_OBJECT('id',pg.id,'title',pg.title,'description',pg.description) AS property_group,JSON_OBJECT('id',st.id,'label',st.label) AS property_status FROM property_contracts AS pc LEFT JOIN properties AS pr ON pr.id = pc.property LEFT JOIN properties_types AS pt ON pt.id = pr.type LEFT JOIN properties_groups AS pg ON pg.id = pr.group LEFT JOIN properties_status AS st ON st.id = pr.status WHERE pr.active = 1 AND pc.finalized = 0 AND pc.canceled = 0 AND ('$year_month' BETWEEN DATE_FORMAT(pc.in_date,'%Y-%m') AND DATE_FORMAT(pc.out_date,'%Y-%m'))";
    
    /*(pc.in_date <= '$srch_start_date' AND pc.out_date >= '$srch_end_date')";*/

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;
    if ($group > 0) {
        $contracts_query .= " AND pr.group = $group";
    };
    
    $contracts_query .= " ORDER BY pc.due_date ASC";

    $contracts_result = $DB->query($contracts_query);
    $summary_data = [];
    if ($contracts_result && $contracts_result->num_rows > 0) {
        while ($row = $contracts_result->fetch_object()) {
            // CONTRACT
            $contract = new stdClass();
            $contract->id = $row->id;
            $contract->currency = $row->currency;
            $contract->type = $row->type;
            $contract->query = $contracts_query;
            $contract->start_date = addTMZero($row->start_date);
            $contract_start_date_time = new DateTime($row->start_date);
            $contract->end_date = addTMZero($row->end_date);
            $contract_end_date_time = new DateTime($row->end_date);

            $contract->in_date = addTMZero($row->in_date);
            //$contract_in_date_time = new DateTime($row->in_date);
            $contract->out_date = addTMZero($row->out_date);
            //$contract_out_date_time = new DateTime($row->out_date);

            $contract->expired = ($NOW->time > $contract_end_date_time) ? true : false;
            $contract->canceled = false;
            $contract->finalized = false;

            //DUE DATE
            $due_date_day = addZero($row->due_date);
            $due_date_day_time = strtotime($year."-".$month."-".$due_date_day);
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

            //TOTAL MONTHS
            $contract_total_months = getTotalMonths($contract->start_date, $contract->end_date);
            $contract->total_months = $contract_total_months;

            //RENT DUE
            $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
            $contract_due_date->due = $rent_is_due;
            $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;
            $contract_due_date->overdue = $rent_is_due;

            $contract->due_date = $contract_due_date;

            //CONTRACTORS
            $contractors_query = "SELECT id,names,surnames,email,phone FROM contracts_contractors WHERE contract = $contract->id";
            $contractors_result = $DB->query($contractors_query);
            $contract->contractors = getRowsArray($contractors_result);

            // add $contract data by type
            require "./$row->type.php";

            // PROPERTY
            $property = new stdClass();
            $property->id = $row->property_id;
            $property->title = $row->property_title;
            $property->description = $row->property_description;
            $property->active_contract = $contract->id;
            $property->group = json_decode($row->property_group, true);
            $property->type = json_decode($row->property_type, true);
            $property->status = json_decode($row->property_status, true);
            
            array_push($summary_data, ['contract'=> $contract, 'property'=> $property]);
        };
    };

    throwSuccess($summary_data);
    $DB->close();
};
?>