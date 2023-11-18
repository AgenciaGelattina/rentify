<?php
require '../headers.php';
require '../utils.php';

if (METHOD === 'GET') {
    require '../database.php';

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;

    $query = "SELECT pr.*,pg.title AS group_title,pt.label AS type_label,st.label AS status_label";
    $query .= " FROM properties AS pr";
    $query .= " LEFT JOIN properties_types AS pt ON pt.id = pr.type";
    $query .= " LEFT JOIN properties_status AS st ON st.id = pr.status";
    $query .= " LEFT JOIN properties_groups AS pg ON pg.id = pr.group";

    if ($group > 0) {
        $query .= " WHERE pr.group =".$group;
    }

    $properties = $DB->query($query);
    
    if ($properties->num_rows > 0) {
        $rows=[];
        while($row=$properties->fetch_object()){
            $row->group = ['id'=>$row->group, 'title'=>$row->group_title];
            $row->type = ['id'=>$row->type, 'label'=>$row->type_label];
            $row->status = ['id'=>$row->status, 'label'=>$row->status_label];
            unset($row->group_label);
            unset($row->type_label);
            unset($row->status_label);
            array_push($rows,$row);
        }
        throwSuccess($rows);
        // echo json_encode($rows, JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No roles found");
    }
}