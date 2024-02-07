<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'GET') {
    require '../../../database.php';

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;

    $query = "SELECT pc.id,pc.value,pc.due_date,pc.start_date,pc.end_date,pr.id as property_id,pr.title,pr.description,pr.group,pg.title AS group_title,pr.type,pt.label AS type_label,pr.status,st.label AS status_label";
    $query .= ",(SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = pc.id GROUP BY cp.contract) AS total_amount";
    $query .= " FROM property_contracts AS pc";
    $query .= " LEFT JOIN properties AS pr ON pr.id = pc.property";
    $query .= " LEFT JOIN properties_types AS pt ON pt.id = pr.type";
    $query .= " LEFT JOIN properties_status AS st ON st.id = pr.status";
    $query .= " LEFT JOIN properties_groups AS pg ON pg.id = pr.group";
    $query .= " WHERE pc.start_date < CURDATE() AND pc.end_date > CURDATE() AND pr.active = 1";

    if ($group > 0) {
        $query .= " AND pr.group =".$group;
    }

    $contracts = $DB->query($query);
    
    if ($contracts->num_rows > 0) {
        $active_contracts=[];
        while($row=$contracts->fetch_object()){

             // Contract
            $contract = new stdClass();
            $contract->id = $row->id;
            $contract->value = $row->value;
            $contract->start_date = $row->start_date."T00:00:00";
            $contract->end_date = $row->end_date."T00:00:00";
            
            $due_date = intval($row->due_date) < 10 ? '0'.$row->due_date : $row->due_date;
            $due_date = date("Y-m")."-".$due_date."T00:00:00";
            $contract->due_date = $due_date;

            $init = new DateTimeImmutable($row->start_date);
            $start_date_time = new DateTime($init->format("Y-m"));
            $end = new DateTimeImmutable($row->end_date);
            $end_date_time = new DateTime($end->format("Y-m")); 
            $today_time = new DateTime(date("Y-m-d"));
            $due_date_time = new DateTime($due_date);                               
            
            $last_day_of_month = new DateTime('now');
            $last_day_of_month->modify('last day of this month');
            $diff = $last_day_of_month->diff($start_date_time); 
            $current_months = (($diff->y) * 12) + ($diff->m) + 1;
            $contract->current_months = $current_months;

            $diff = $end_date_time->diff($start_date_time); 
            $total_months = (($diff->y) * 12) + ($diff->m);
            $contract->total_months = $total_months;
            $contract->pending_months = $total_months - $current_months;

            $total_amount_pending = $row->value * $current_months;
            $total_amount = $row->total_amount ?: 0;
            
            $contract->in_debt = ($total_amount < $total_amount_pending);
            $contract->rent_is_due = ($today_time >= $due_date_time);
            $contract->debt = $total_amount_pending - $total_amount;

            // Property
            $property = new stdClass();
            $property->id = $row->property_id;
            $property->title = $row->title;
            $property->description = $row->description;
            $property->group = ['id'=>$row->group, 'title'=>$row->group_title];
            $property->type = ['id'=>$row->type, 'label'=>$row->type_label];
            $property->status = ['id'=>$row->status, 'label'=>$row->status_label];
            $contract->property = $property;

            array_push($active_contracts, $contract);
        }
        throwSuccess($active_contracts);
    } else {
        throwError(203, "No se encontraron contratos activos.");
    }
    $DB->close();
}