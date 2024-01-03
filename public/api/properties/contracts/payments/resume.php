<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'GET') {
    require '../../../database.php';

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;

    $query = "SELECT pc.id,pc.value,pc.due_date,pr.id as property_id,pr.title,pr.description,pr.group,pg.title AS group_title,pr.type,pt.label AS type_label,pr.status,st.label AS status_label FROM property_contracts AS pc";
    $query .= " LEFT JOIN properties AS pr ON pr.id = pc.property";
    $query .= " LEFT JOIN properties_types AS pt ON pt.id = pr.type";
    $query .= " LEFT JOIN properties_status AS st ON st.id = pr.status";
    $query .= " LEFT JOIN properties_groups AS pg ON pg.id = pr.group";
    $query .= " WHERE pc.init_date < CURDATE() AND pc.end_date > CURDATE() AND pr.active = 1";

    if ($group > 0) {
        $query .= " AND pr.group =".$group;
    }

    $properties = $DB->query($query);
    
    if ($properties->num_rows > 0) {
        $rows=[];
        $today = date("Y-m-d");
        while($row=$properties->fetch_object()){
            $row->status = 0;
            $row->due_date = date("Y-m")."-$row->due_date";
            // property
            $row->property = new stdClass();
            $row->property->id = $row->property_id;
            $row->property->title = $row->title;
            $row->property->description = $row->description;
            $row->property->group = ['id'=>$row->group, 'title'=>$row->group_title];
            $row->property->type = ['id'=>$row->type, 'label'=>$row->type_label];
            $row->property->status = ['id'=>$row->status, 'label'=>$row->status_label];
            // clean
            unset($row->property_id);
            unset($row->title);
            unset($row->description);
            unset($row->group);
            unset($row->type);
            unset($row->status);
            unset($row->group_title);
            unset($row->type_label);
            unset($row->status_label);

            array_push($rows,$row);
        }
        throwSuccess($rows);
    } else {
        throwError(203, "No se encontraron pagos activos.");
    }
    $DB->close();
}