<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'GET') {
    require '../database.php';

    $query = "SELECT pr.id,pr.title,pr.description,pr.active,JSON_OBJECT('id',pr.type,'label',pt.label) AS `type`,JSON_OBJECT('id',pr.status,'label',st.label) AS `status`,JSON_OBJECT('id',pr.group,'title',pg.title,'description',pg.description) AS `group`,IF(ac.id > 0 ,JSON_OBJECT('id',ac.id,'name',ac.names,'surname',ac.surnames,'role',JSON_OBJECT('id',acr.id,'label',acr.label)), NULL) AS assignment,pc.id AS active_contract FROM properties AS pr LEFT JOIN properties_types AS pt ON pt.id = pr.type LEFT JOIN properties_status AS st ON st.id = pr.status LEFT JOIN properties_groups AS pg ON pg.id = pr.group LEFT JOIN accounts AS ac ON pr.assignment = ac.id LEFT JOIN accounts_roles AS acr ON acr.id = ac.role LEFT JOIN property_contracts AS pc ON (pc.property = pr.id AND pc.end_date >= CURDATE() AND pc.canceled = 0 AND pc.finalized = 0)";

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;
    if ($group > 0) {
        $query .= " WHERE pr.group = $group";
    };

    $properties = $DB->query($query);
    
    if ($properties->num_rows > 0) {
        $rows=[];
        while($row=$properties->fetch_object()){
            $row->type = json_decode($row->type, true);
            $row->status = json_decode($row->status, true);
            $row->group = json_decode($row->group, true);
            $row->assignment = json_decode($row->assignment, true);
            array_push($rows,$row);
        }
        throwSuccess($rows);
    } else {
        throwError(203, "No se encontraron propiedades.");
    }
}